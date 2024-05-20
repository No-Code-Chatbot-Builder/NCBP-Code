import os
from app.config.ddb_config import initialize_db
from app.services.data.generation import *
from app.config.s3_config import s3
from app.services.ddb.index import construct_s3_keys,fetch_dataset_info
from app.services.s3.index import fetch_s3_docs,save_to_db
from app.services.openAi.dataset import merge_jsonl_data,convert_to_jsonl
from app.utils.web_scraping import web_scraping
from app.utils.chunking import file_processing
from boto3.dynamodb.conditions import Key


class Config:
    DDB_TABLE_NAME =  os.getenv('DDB_TABLE_NAME')


#tested
async def save_jsonl_to_file(jsonl_str, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(jsonl_str)
    print(f"File saved successfully as {filename}")

  
async def preprocess_links(links):
    data = web_scraping.web_scrap(links)
    chunks = file_processing(data)
    questions, answers = llm_pipeline(chunks)
    jsonl_data = convert_to_jsonl(questions, answers)
    return jsonl_data

#tested
async def preprocess_docs(docs,table,user_id, workspace_id, dataset_id):
   s3_keys = await construct_s3_keys(docs,table,user_id, workspace_id, dataset_id)
   chunks = await fetch_s3_docs(s3_keys)
   print("chunk size--------------",len(chunks))
   qa_obj = await llm_pipeline(chunks)
   jsonl_data = await convert_to_jsonl(qa_obj)
   await save_jsonl_to_file(jsonl_data, 'output.jsonl')

   return jsonl_data
      
   
async def configure_data( user_id, workspace_id, dataset_id):
    ddb = initialize_db() 
    table = ddb.Table(Config.DDB_TABLE_NAME)
    response = table.query(
        KeyConditionExpression=Key('PK').eq(f'WORKSPACE#{workspace_id}') & Key('SK').eq(f'DATASET#{dataset_id}')
    )
    # print(response)
    if response['Items'][0]['jsonlId'] != '':
         s3_key = f"USER#{user_id}/WORKSPACE#{workspace_id}/DATASET#{dataset_id}/{response['Items'][0]['jsonlId']}"
         obj = s3.get_object(Bucket='ncbp-assets', Key=s3_key)
         return obj
    else:
        docs,links = await fetch_dataset_info(table, dataset_id)
        jsonl_scrap_data , jsonl_docs_data = ''
        if (len(links) > 0):
            jsonl_scrap_data = await preprocess_links(links)
        if (len(docs) > 0):
            jsonl_docs_data = await preprocess_docs(docs,table,user_id, workspace_id, dataset_id)
        merged_jsonl_data = await merge_jsonl_data(jsonl_scrap_data,jsonl_docs_data)
        await save_to_db(merged_jsonl_data,table,user_id, workspace_id, dataset_id)
        return merged_jsonl_data
