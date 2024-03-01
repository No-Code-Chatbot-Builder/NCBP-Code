from boto3.dynamodb.conditions import Key
import pathlib
from dotenv import load_dotenv
import os
from app.aws.s3_config import s3
from app.aws.ddb_config import initialize_db


base_dir = pathlib.Path(__file__).parent.parent
load_dotenv(base_dir.joinpath('.env'))

class Config:
    S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')
    DDB_TABLE_NAME =  os.getenv('DDB_TABLE_NAME')

async def fetch_dataset_info(dataset_id):
    ddb = initialize_db() 
    table = ddb.Table('ncbp')
    response = table.query(
        KeyConditionExpression=Key('PK').eq(f'DATASET#{dataset_id}') & Key('SK').begins_with('DATA#')
    )
    return response['Items']



def construct_s3_keys(items,user_id,workspace_id, dataset_id):
    s3_keys = [f"USER#{user_id}/WORKSPACE#{workspace_id}/DATASET#{dataset_id}/{item['name']}" for item in items]
    return s3_keys



async def process_documents(s3_keys):
    for key in s3_keys:
        try:
            response = s3.get_object(Bucket='ncbp-assets-bucket', Key=key)
            # Here, you might download the file, process its contents, etc.
            print(f"Processing document: {key}")
        except Exception as e:
            print(f"Failed to download document {key}: {e}")