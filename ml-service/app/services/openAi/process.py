from openai import OpenAI
import os

class Config:
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    
client = OpenAI(api_key = Config.OPENAI_API_KEY)

def create_fine_tuning_job(model,epochs,batch_size,learning_rate,max_tokens,file_id):
    fine_tuning_job = client.FineTune.create(
    model_engine=model,
    n_epochs=epochs,
    batch_size=batch_size,
    learning_rate=learning_rate,
    max_tokens=max_tokens,
    training_file=file_id,
    )

    return fine_tuning_job.id

def check_fine_tuning_job_status(job_id):
    response = client.fine_tuning.jobs.retrieve(id=job_id)
    return response.status

def cancel_fine_tuning_job(job_id):
    response = client.fine_tuning.jobs.cancel(id=job_id)
    return response.status

def delete_fine_tuned_model(job_id):
    response = client.fine_tuning.jobs.cancel(id=job_id)
    client.models.delete("ft:gpt-3.5-turbo:acemeco:suffix:abc123")
    return response.status

def upload_jsonl_to_openAi():
    file_id = client.files.create(
                file=open("mydata.jsonl", "rb"),
                purpose="fine-tune"
            )
    return file_id

