import openai

openai.api_key = "api_key"

def upload_file(filepath):
    response = openai.File.create(file=open(filepath), purpose="fine-tune")
    return response.id


def create_fine_tuning_job(file_id, model="gpt-3.5-turbo"):
    # fine_tuning_job = openai.FineTune.create(
    # model_engine=model_engine,
    # n_epochs=n_epochs,
    # batch_size=batch_size,
    # learning_rate=learning_rate,
    # max_tokens=max_tokens,
    # training_file=os.path.abspath(training_file),
    # validation_file=os.path.abspath(validation_file),
    # )

    response = openai.FineTune.create(training_file=file_id, model=model)
    return response.id


def check_fine_tuning_job_status(job_id):
    response = openai.FineTune.retrieve(id=job_id)
    return response.status

