import os
from app.config.ddb_config import table
from app.services.data.generation import *
from app.config.s3_config import s3
from app.services.ddb.index import construct_s3_keys,fetch_dataset_info
from app.services.s3.index import fetch_s3_docs,save_to_db
from app.services.openAi.dataset import merge_jsonl_data,convert_to_jsonl
from app.utils.web_scraping import web_scrap
from app.utils.chunking import file_processing
from boto3.dynamodb.conditions import Key


#tested
async def save_jsonl_to_file(jsonl_str, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(jsonl_str)
    print(f"File saved successfully as {filename}")


async def preprocess_links(links):
    data = web_scraping.web_scrap(links)
    chunks = await file_processing(data)
    qa_pairs= await llm_pipeline(chunks)
    jsonl_data = await convert_to_jsonl(qa_pairs)
    return jsonl_data

#tested
async def preprocess_docs(docs,user_id, workspace_id, dataset_id):
   s3_keys = await construct_s3_keys(docs,user_id, workspace_id, dataset_id)
   chunks = await fetch_s3_docs(s3_keys)
   print("chunk size--------------",len(chunks))
   qa_obj = await llm_pipeline(chunks)
   jsonl_data = await convert_to_jsonl(qa_obj)
  
   return jsonl_data
      
#tested
async def configure_data(user_id, workspace_id, dataset_id):
    try:  
        response = table.query(
            KeyConditionExpression=Key('PK').eq(f'WORKSPACE#{workspace_id}') & Key('SK').eq(f'DATASET#{dataset_id}')
        )
        if response['Items'][0]['jsonlId'] != '':
            # s3_key = f"USER#{user_id}/WORKSPACE#{workspace_id}/DATASET#{dataset_id}/JSONL#{response['Items'][0]['jsonlId']}"
            # jsonl_object = s3.get_object(Bucket='ncbp-assets', Key=s3_key)
            # jsonl_data = jsonl_object['Body'].read()
            # print("jsonl data already exist : fetching it from s3....")
            data_id = response['Items'][0]['jsonlId']
            return {"statuscode": 403, "content": data_id}
        else:
            docs, links = await fetch_dataset_info(dataset_id)
            jsonl_scrap_data, jsonl_docs_data = '', ''

            if not docs and not links:
                return {"statuscode": 204, "content": []}

            if len(links) > 0:
                jsonl_scrap_data = await preprocess_links(links)
            if len(docs) > 0:
                jsonl_docs_data = await preprocess_docs(docs, user_id, workspace_id, dataset_id)

            if not jsonl_scrap_data and not jsonl_docs_data:
                return {"statuscode": 204, "content": []}
            merged_jsonl_data = await merge_jsonl_data(jsonl_scrap_data, jsonl_docs_data)
            response = await save_to_db(merged_jsonl_data, user_id, workspace_id, dataset_id)
            return {"statuscode": 200, "content": response}
    except Exception as e:
        print(f"An error occurred: {e}")
        return {"statuscode": 500, "content": str(e)}
