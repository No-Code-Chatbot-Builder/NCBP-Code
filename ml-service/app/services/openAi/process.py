from openai import OpenAI
import os
from app.config.ddb_config import table
from app.services.ddb.index import save_fine_tuning_job_to_dynamodb,update_fine_tuning_job_on_success,update_fine_tuning_job_on_cancel
from datetime import datetime
import io

class Config:
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

client = OpenAI(api_key = Config.OPENAI_API_KEY)

#tested
async def create_fine_tuning_job(file_id,input,user_id):
    response = client.fine_tuning.jobs.create(
    model=input.model,
    # hyperparameters={
    # "n_epochs":input.epochs,
    # "learning_rate_multiplier" : input.lr,
    # "batch_size":input.batch_size,
    # },
    # suffix=input.bot_name,
    # max_tokens=10000,
    training_file=file_id,
    )
    
    if response.status == 'validating_files':
          # Save to DynamoDB
        await save_fine_tuning_job_to_dynamodb(
            workspace_id=input.workspace_id, fine_tuning_job=response,
            user_id=user_id, created_at=datetime.now().isoformat(),
            instruction=input.purpose, data_id=file_id,
            assistant_name=input.bot_name,
            batch_size=input.batch_size,
            epochs= input.epochs,
            lr = input.lr
        )
    return {
            'jobId' : response.id,
            'assistantId': '', #here when model training is completed id will be inserted and status will be changed with complete
            'assistantName': input.bot_name,
            'purpose': input.purpose,
            'baseModel' : response.model,
            'trainingFileId': file_id,
            'epochs' : input.epochs,
            'batchSize' : input.batch_size,
            'learningRate' : input.lr,
            'status' : 'In Progress',
            'organisationId' : response.organization_id,
            'createdBy': user_id,
            'createdAt': datetime.now().isoformat(),
        }

#tested
async def check_fine_tuning_job_status(workspace_id,job_id):
    response = client.fine_tuning.jobs.retrieve(job_id)
    
    if response.status == 'succeeded':
       await update_fine_tuning_job_on_success(workspace_id,job_id,response.fine_tuned_model)
    elif response.status == 'cancelled':
        await update_fine_tuning_job_on_cancel(workspace_id,job_id)

    return response.status

async def cancel_fine_tuning_job(workspace_id,job_id):
    response = client.fine_tuning.jobs.cancel(job_id)
    await update_fine_tuning_job_on_cancel(workspace_id,job_id)
    return response.status

async def delete_fine_tuned_model(job_id):
    response = client.fine_tuning.jobs.cancel(id=job_id)
    client.models.delete("ft:gpt-3.5-turbo:acemeco:suffix:abc123")
    return response.status

#tested
async def upload_jsonl_to_openAi(jsonl_data):
    # file_like_object = io.BytesIO(jsonl_data.encode('utf-8'))
    
    file_response = client.files.create(
                            file=open("local_data.jsonl", "rb"),
                            purpose="fine-tune"
                        )
    return file_response.id


