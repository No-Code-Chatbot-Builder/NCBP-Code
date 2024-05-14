import openai

openai.api_key = "api_key"

def upload_file(filepath):
    response = openai.File.create(file=open(filepath), purpose="fine-tune")
    return response.id


def create_fine_tuning_job(model,epochs,batch_size,learning_rate,max_tokens,file):
    fine_tuning_job = openai.FineTune.create(
    model_engine=model,
    n_epochs=epochs,
    batch_size=batch_size,
    learning_rate=learning_rate,
    max_tokens=max_tokens,
    training_file=file,
    # validation_file=os.path.abspath(validation_file),
    )

    return fine_tuning_job.id


def check_fine_tuning_job_status(job_id):
    response = openai.FineTune.retrieve(id=job_id)
    return response.status

