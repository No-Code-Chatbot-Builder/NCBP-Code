from boto3 import client
from dotenv import load_dotenv
import pathlib
import os

base_dir = pathlib.Path(__file__).parent.parent

load_dotenv(base_dir.joinpath('.env'))


class Config:
    AWS_REGION_NAME = os.getenv('AWS_REGION_NAME')
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')


s3 = client(
    's3',
    # region_name= 'us-east-1',
    # aws_access_key_id='AKIAZI2LCWDBD6NFLK3C',
    # aws_secret_access_key='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'
    region_name= Config.AWS_REGION_NAME,
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY,
)
