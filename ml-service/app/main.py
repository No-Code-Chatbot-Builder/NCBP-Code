from fastapi import FastAPI,WebSocket
from pydantic import BaseModel
from app.data_pipeline.data import configure_data
from fastapi.middleware.cors import CORSMiddleware
import pathlib
from dotenv import load_dotenv
import os
import uvicorn
from app.services.openAi.process import *
import openai
from app.services.ddb.index import retrieve_all_fine_tuned_bots
from fastapi.middleware import Middleware
from app.middleware.auth.index import AuthMiddleware
from fastapi import Request

base_dir = pathlib.Path(__file__).parent
load_dotenv(base_dir.joinpath('.env'))

middleware = [
    Middleware(AuthMiddleware)
]
app = FastAPI(title = "Fine Tuning Service",middleware=middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FineTuneRequest(BaseModel):
    dataset_id: str
    workspace_id: str
    model: str
    bot_name : str
    batch_size : str
    lr : str
    epochs : str
    purpose : str
    

class Config:
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')


@app.get("/model")
async def root():
    return {"message": "Greetings from ML server!!"}
    
#tested
@app.get("/model/status")
async def check_job_status(job_id: str,workspace_id : str):
    status = await check_fine_tuning_job_status(job_id=job_id,workspace_id=workspace_id)
    return {"status": status}

@app.get("/model/cancel_job")
async def cancel_job(job_id: str):
    status = cancel_fine_tuning_job(job_id)
    return {"Cancelled status": status}

#tested
@app.get("/model/models")
async def get_fine_tuned_bots(workspace_id: str):
    bots = await retrieve_all_fine_tuned_bots(workspace_id)
    return {
        "statusCode": 200,
        "bots": bots
        }

#tested
@app.post("/model/fine-tune")
async def fine_tune_model(request: Request, fine_tune_request: FineTuneRequest):
    response = await configure_data( request.state.user.get('id'), fine_tune_request.workspace_id,fine_tune_request.dataset_id)
    data_id = ''
    if response.get("statuscode") == 202:
        data_id = await upload_jsonl_to_openAi(response.get("content"))
        
    elif response.get("statuscode") == 409:
        data_id = response.get("content")
    
    else:
        return {
            "statusCode" : response.get("statuscode"),
            "message" : "There was an error generating data for fine-tuning. Please verify if your dataset is well-formed"
            }
    
    response = await create_fine_tuning_job(file_id=data_id,input=fine_tune_request,user_id=request.state.user.get('id'))

    return {
        "statusCode": 201,
        "message": "Fine-tuning process started",
        "data": response
    }


# @app.websocket("/chat")
# async def chat(websocket: WebSocket):
#     client = OpenAI(api_key = Config.OPENAI_API_KEY)
#     await websocket.accept()
    
#     while True:
#         data = await websocket.receive_text()
#         print("user query : ",data)
#         completion = client.chat.completions.create(
#             model="ft:gpt-3.5-turbo:my-org:custom_suffix:id",
#             messages=[
#                 {"role": "system", "content": "You are a helpful assistant."},
#                 {"role": "user", "content": "Hello!"}
#             ]
#         )
#         print(completion.choices[0].message)
#         async for chunk in response:
#             if "choices" in chunk:
#                 delta = chunk.choices[0].delta
#                 if "content" in delta:
#                     content = delta.content
#                     print(content, end="")
#                     await websocket.send_text(content)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, log_level="debug",
                proxy_headers=True, reload=True)


# for fine tuning process. 
    # The flow will be the following
        # import dataset wrt dataset id 
        # check if data is jsonl form or anyother
        # other forms:
            # handling data based on format
            # pre processing pipeline - cleaning,correference resolution 
            # qa-generation
            
