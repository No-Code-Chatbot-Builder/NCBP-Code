from openai import OpenAI
import os
from app.config.ddb_config import table
from app.services.ddb.index import save_fine_tuning_job_to_dynamodb,update_fine_tuning_job_on_success,update_fine_tuning_job_on_cancel
from datetime import datetime

class Config:
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

client = OpenAI(api_key = Config.OPENAI_API_KEY)

async def create_fine_tuning_job(file_id,input):
    response = client.fine_tuning.jobs.create(
    model=input.model,
    n_epochs=input.n_epochs,
    batch_size=input.batch_size,
    learning_rate=input.lr,
    max_tokens=10000,
    training_file=file_id,
    )
    
    if response.status == 'queued':
          # Save to DynamoDB
        await save_fine_tuning_job_to_dynamodb(
            workspace_id=input.workspace_id, fine_tuning_job=response.id,
            user_id=input.user_id, created_at=datetime.now().isoformat(),
            instruction="fine-tuning", data_id=file_id,
            assistant_name=input.bot_name,
            batch_size=input.batch_size,
            epochs= input.epochs,
            lr = input.lr
        )
        #     {
        #   "object": "fine_tuning.job",
        #   "id": "ftjob-abc123",
        #   "model": "gpt-3.5-turbo-0125",
        #   "created_at": 1614807352,
        #   "fine_tuned_model": null,
        #   "organization_id": "org-123",
        #   "result_files": [],
        #   "status": "queued",
        #   "validation_file": null,
        #   "training_file": "file-abc123",
        # }

async def check_fine_tuning_job_status(workspace_id,job_id):
    response = client.fine_tuning.jobs.retrieve(job_id)
    
    if response['Status'] == 'succeeded':
       update_fine_tuning_job_on_success(workspace_id,job_id,response['fine_tuned_model'])
    elif response['Status'] == 'cancelled':
        update_fine_tuning_job_on_cancel(workspace_id,job_id)
#     {
#   "object": "fine_tuning.job",
#   "id": "ftjob-abc123",
#   "model": "davinci-002",
#   "created_at": 1692661014,
#   "finished_at": 1692661190,
#   "fine_tuned_model": "ft:davinci-002:my-org:custom_suffix:7q8mpxmy",
#   "organization_id": "org-123",
#   "result_files": [
#       "file-abc123"
#   ],
#   "status": "succeeded",
#   "validation_file": null,
#   "training_file": "file-abc123",
#   "hyperparameters": {
#       "n_epochs": 4,
#       "batch_size": 1,
#       "learning_rate_multiplier": 1.0
#   },
#   "trained_tokens": 5768,
#   "integrations": [],
#   "seed": 0,
#   "estimated_finish": 0
# }

    return response.status

async def cancel_fine_tuning_job(workspace_id,job_id):
    response = client.fine_tuning.jobs.cancel(job_id)
    await update_fine_tuning_job_on_cancel(workspace_id,job_id)
    return response.status

async def delete_fine_tuned_model(job_id):
    response = client.fine_tuning.jobs.cancel(id=job_id)
    client.models.delete("ft:gpt-3.5-turbo:acemeco:suffix:abc123")
    return response.status

async def upload_jsonl_to_openAi(jsonl_data):
    file_id = client.files.create(
                file=jsonl_data,
                purpose="fine-tune"
            )
    return file_id


