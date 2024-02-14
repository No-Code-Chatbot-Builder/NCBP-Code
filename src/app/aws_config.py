from boto3 import client
from botocore.exceptions import NoCredentialsError, ClientError


s3_client = client(
    's3',
    region_name='AWS_REGION_NAME',
    aws_access_key_id='AWS_ACCESS_KEY_ID',
    aws_secret_access_key='AWS_SECRET_ACCESS_KEY'
)

bucket_name = S3_BUCKET_NAME 