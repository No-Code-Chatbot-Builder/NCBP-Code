from boto3 import client
import os

class Config:
    AWS_REGION_NAME = os.getenv('AWS_REGION_NAME')
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')


#tested
s3 = client(
    's3',
    region_name= Config.AWS_REGION_NAME,
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
)

