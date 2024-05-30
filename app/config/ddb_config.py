import os
import boto3
import pathlib
from dotenv import load_dotenv
from boto3.resources.base import ServiceResource

base_dir = pathlib.Path(__file__).parent.parent.parent

load_dotenv(base_dir.joinpath('.env'))

class Config:
    AWS_REGION_NAME = os.getenv('AWS_REGION_NAME')
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    DDB_TABLE_NAME =  os.getenv('DDB_TABLE_NAME')


#tested
def initialize_db() -> ServiceResource:
    ddb = boto3.resource('dynamodb',
                         region_name=Config.AWS_REGION_NAME,
                         aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
                         aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY)
    print("dynamo db connected")
    return ddb

ddb = initialize_db()
table = ddb.Table(Config.DDB_TABLE_NAME)

