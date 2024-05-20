from boto3.dynamodb.conditions import Key


#tested
async def construct_s3_keys(items,table, user_id, workspace_id, dataset_id):
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
async def fetch_dataset_info(table, dataset_id):
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
