from boto3.dynamodb.conditions import Key,Attr
from app.config.ddb_config import table
import uuid


#tested
async def construct_s3_keys(items, user_id, workspace_id, dataset_id):
    data_ids = []
    for item in items:
        response = table.query(
            KeyConditionExpression=Key('PK').eq(f'DATANAME#{item["name"]}') & Key('SK').begins_with('FILE#')
        )
        ids = [(res['id'],item['name']) for res in response['Items']]
        data_ids.extend(ids)
    s3_keys = [(f"USER#{user_id}/WORKSPACE#{workspace_id}/DATASET#{dataset_id}/{data_id}",name) for data_id,name in data_ids]
    # print("s3 keys-----------------------------------------",s3_keys)
    return s3_keys

#tested
async def fetch_dataset_info(dataset_id):
    response = table.query(
        KeyConditionExpression=Key('PK').eq(f'DATASET#{dataset_id}') & Key('SK').begins_with('DATA#')
    )
    # print(response)
    items =  response['Items']
    docs = [item for item in items if item['type'] == 'file']
    links = [item for item in items if item['type'] == 'url']
    # print("Docs : ----------",docs)
    # print("Links : ----------",links)
    return docs,links

#tested
async def save_fine_tuning_job_to_dynamodb(workspace_id, fine_tuning_job, user_id, created_at, instruction, data_id, assistant_name,epochs,lr,batch_size):
    id = str(uuid.uuid4())
    table.put_item(
        Item={
            'PK': f'WORKSPACE#{workspace_id}',
            'SK': f'FTASSISTANT#{id}',
            'jobId' : fine_tuning_job.id,
            'assistantId': '', #here when model training is completed id will be inserted and status will be changed with complete
            'assistantName': assistant_name,
            'purpose': instruction,
            'baseModel' : fine_tuning_job.model,
            'trainingFileId': data_id,
            'epochs' : epochs,
            'batchSize' : batch_size,
            'learningRate' : lr,
            'status' : 'In Progress',
            'organisationId' : fine_tuning_job.organization_id,
            'createdBy': user_id,
            'createdAt': created_at,
            'deleted' : 'false'
        }
    )


async def retrieve_all_fine_tuned_bots(workspace_id):
    response = table.query(
        KeyConditionExpression=Key('PK').eq(f'WORKSPACE#{workspace_id}') &
                               Key('SK').begins_with('FTASSISTANT#'),
        FilterExpression=Attr('status').eq('succeeded') | Attr('status').eq('In Progress')
    )
    return response['Items']

#tested
async def update_fine_tuning_job_on_success(workspace_id,job_id,assistant_id):
    items = table.scan(
        FilterExpression= Key('PK').eq(f'WORKSPACE#{workspace_id}') & Key('SK').begins_with('FTASSISTANT#') & Key('jobId').eq(job_id)
    )['Items']
    
    for item in items:
        table.update_item(
            Key={
                'PK': item['PK'],
                'SK': item['SK']
            },
            UpdateExpression='SET #status = :status, assistantId = :assistantId',
            ExpressionAttributeNames={
                '#status': 'status'
            },
            ExpressionAttributeValues={
                ':status': 'succeeded',
                ':assistantId': assistant_id
            },
            ReturnValues="UPDATED_NEW"
        )
        

async def update_fine_tuning_job_on_cancel(workspace_id,job_id):
 
    items = table.scan(
        FilterExpression= Key('PK').eq(f'WORKSPACE#{workspace_id}') & Key('SK').begins_with('FTASSISTANT#') & Key('jobId').eq(job_id)
    )['Items']
    
    for item in items:
        table.update_item(
            Key={
                'PK': item['PK'],
                'SK': item['SK']
            },
            UpdateExpression='SET #status = :status',
            ExpressionAttributeNames={
                '#status': 'status'
            },
            ExpressionAttributeValues={
                ':status': 'cancelled',
            },
            ReturnValues="UPDATED_NEW"
        )        
        

