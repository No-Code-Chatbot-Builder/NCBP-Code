from boto3.dynamodb.conditions import Key
import pathlib
from dotenv import load_dotenv
import os
import uuid
from app.config.s3_config import s3
from app.config.ddb_config import initialize_db
from app.services.data.generation import *
from app.utils import extract_docs,web_scraping
import json

base_dir = pathlib.Path(__file__).parent.parent
load_dotenv(base_dir.joinpath('.env'))

class Config:
    S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')
    DDB_TABLE_NAME =  os.getenv('DDB_TABLE_NAME')


def file_processing(text):
    # nlp = spacy.load('en_core_web_md') 
    # neuralcoref.add_to_pipe(nlp)
    # doc = nlp(text)
    # doc = doc._.coref_resolved
    splitter_ques_gen = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks_ques_gen = splitter_ques_gen.split_text(text) #doc
    document_ques_gen = [Document(page_content=t) for t in chunks_ques_gen]

    return document_ques_gen


async def fetch_dataset_info(dataset_id):
    ddb = initialize_db() 
    table = ddb.Table(Config.DDB_TABLE_NAME)
    response = table.query(
        KeyConditionExpression=Key('PK').eq(f'DATASET#{dataset_id}') & Key('SK').begins_with('DATA#')
    )
    items =  response['Items']
    docs = [item for item in items if item['type'] != 'file']
    links = [item for item in items if item['type'] != 'url']
    return docs,links
    
def construct_s3_keys(items,ddb, user_id, workspace_id, dataset_id):
    table = ddb.Table(Config.DDB_TABLE_NAME)
    data_ids = []
    
    for item in items:
        response = table.query(
            KeyConditionExpression=Key('PK').eq(f'DATANAME#{item["name"]}') & Key('SK').begins_with('FILE#')
        )
        ids = [(res['id'],item['name']) for res in response['Items']]
        data_ids.extend(ids)
    s3_keys = [(f"USER#{user_id}/WORKSPACE#{workspace_id}/DATASET#{dataset_id}/{data_id}",name) for data_id,name in data_ids]
    return s3_keys

async def fetch_s3_docs(s3_keys):
    qa_chunks = []
    for key,name in s3_keys:
        file_extension = name.split('.')[-1].lower()
        try:
            response = s3.get_object(Bucket=Config.S3_BUCKET_NAME, Key=key)
            file_bytes = response['Body'].read()
            file_extension = name.split('.')[-1].lower()
            print(file_extension)
            if file_extension == 'pdf':
                content = await extract_docs.read_pdf_content(file_bytes)
            elif file_extension in ['doc', 'docx']:
                content = await extract_docs.read_docx_content(file_bytes)
            elif file_extension == 'pptx':
                content = await extract_docs.read_pptx_content(file_bytes)
            else:
                print(f"Unsupported file type: {file_extension}")
                continue
            
            qa_chunks.append(file_processing(content))
            print(f"Processing document: {key} with doc name {name}")
        except Exception as e:
            print(f"Failed to download or process document {key}: {e}")
            
    return qa_chunks

def convert_to_jsonl(questions, answers):
    jsonl_str = ""
    for question, answer in zip(questions, answers):
        record = {"prompt": question, "completion": f"{answer}\n"}
        jsonl_str += json.dumps(record) + "\n"
    
    return jsonl_str

def merge_jsonl_data(jsonl_data1, jsonl_data2):
    if not jsonl_data1.endswith('\n'):
        jsonl_data1 += '\n'

    merged_jsonl_data = jsonl_data1 + jsonl_data2
    return merged_jsonl_data

def save_to_db(jsonl_data,ddb,user_id, workspace_id, dataset_id):
    data_id = str(uuid.uuid4())
    key = f"USER#{user_id}/WORKSPACE#{workspace_id}/DATASET#{dataset_id}/{data_id}"
    try:
        response = s3.put_object(Bucket='ncbp-assets', Key=key, Body=jsonl_data)
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            table = ddb.Table('ncbp')
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
   
def preprocess_links(links):
    data = web_scraping.web_scrap(links)
    chunks = file_processing(data)
    questions, answers = llm_pipeline(chunks)
    jsonl_data = convert_to_jsonl(questions, answers)
    return jsonl_data

def preprocess_docs(docs,ddb,user_id, workspace_id, dataset_id):
   s3_keys = construct_s3_keys(docs,ddb,user_id, workspace_id, dataset_id)
   chunks = fetch_s3_docs(s3_keys)
   questions, answers = llm_pipeline(chunks)
   jsonl_data = convert_to_jsonl(questions, answers)
   return jsonl_data
      
   
async def configure_data( user_id, workspace_id, dataset_id):
    ddb = initialize_db() 
    table = ddb.Table('ncbp')
    response = table.query(
        KeyConditionExpression=Key('PK').eq(f'WORKSPACE#{workspace_id}') & Key('SK').eq(f'DATASET#{dataset_id}')
    )
    if response['Items']['jsonl_id'] != '':
         s3_key = f"USER#{user_id}/WORKSPACE#{workspace_id}/DATASET#{dataset_id}/{response['Items']['jsonl_id']}"
         obj = s3.get_object(Bucket='ncbp-assets', Key=s3_key)
         return obj
    else:
        docs,links = fetch_dataset_info(dataset_id)
        jsonl_scrap_data = preprocess_links(links)
        jsonl_docs_data = preprocess_docs(docs,ddb,user_id, workspace_id, dataset_id)
        merged_jsonl_data = merge_jsonl_data(jsonl_scrap_data,jsonl_docs_data)
        save_to_db(merged_jsonl_data,ddb,user_id, workspace_id, dataset_id)
        return merged_jsonl_data
