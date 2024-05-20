from app.config.s3_config import s3
from app.utils import extract_docs,web_scraping
import os
import uuid
from app.utils.chunking import file_processing


class Config:
    S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')


#tested
async def fetch_s3_docs(s3_keys):
    qa_chunks = []
    for key,name in s3_keys:
        file_extension = name.split('.')[-1].lower()
        try:
            response = s3.get_object(Bucket=Config.S3_BUCKET_NAME, Key=key)
            file_bytes = response['Body'].read()
            # print("data----------" ,file_bytes)
            if file_extension == 'pdf':
                content = await extract_docs.read_pdf_content(file_bytes)
            elif file_extension in ['doc', 'docx']:
                content = await extract_docs.read_docx_content(file_bytes)
            elif file_extension == 'pptx':
                content = await extract_docs.read_pptx_content(file_bytes)
            else:
                print(f"Unsupported file type: {file_extension}")
                continue
            qa_chunks.extend(await file_processing(content))
            print(f"Processing document: {key} with doc name {name}")
        except Exception as e:
            print(f"Failed to download or process document {key}: {e}")
    return qa_chunks



async def save_to_db(jsonl_data,table,user_id, workspace_id, dataset_id):
    data_id = str(uuid.uuid4())
    key = f"USER#{user_id}/WORKSPACE#{workspace_id}/DATASET#{dataset_id}/jsonl/{data_id}"
    try:
        response = s3.put_object(Bucket=Config.S3_BUCKET_NAME, Key=key, Body=jsonl_data)
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            updated_response = table.update_item(
                Key={
                    'PK': f'WORKSPACE#{workspace_id}',
                    'SK': f'DATASET#{dataset_id}'
                },
                UpdateExpression='SET jsonl_id = :val',
                ExpressionAttributeValues={
                    ':val': data_id
                },
                ReturnValues="UPDATED_NEW"
            )
            print("S3 upload and DynamoDB update successful.")
            return updated_response
        else:
            print("Failed to upload to S3.")
    except Exception as e:
        print(f"Error occurred: {str(e)}")
 