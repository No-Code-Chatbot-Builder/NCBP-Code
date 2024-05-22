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

base_dir = pathlib.Path(__file__).parent
load_dotenv(base_dir.joinpath('.env'))

app = FastAPI(title = "Fine Tuning Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["backend url"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FineTuneRequest(BaseModel):
    user_id: str
    dataset_id: str
    workspace_id: str
    model: str
    bot_name : str
    batch_size : str
    lr : str
    epochs : str
    

class Config:
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')



@app.get("/")
async def root():
    return {"message": "Greetings from ML server!!"}
    

@app.get("/check_status")
async def check_job_status(job_id: str):
    status = check_fine_tuning_job_status(job_id)
    return {"status": status}


@app.get("/cancel_job")
async def cancel_job(job_id: str):
    status = cancel_fine_tuning_job(job_id)
    return {"Cancelled status": status}


@app.get("/finetuned_bots")
async def get_fine_tuned_bots(workspace_id: str):
    bots = retrieve_all_fine_tuned_bots(workspace_id)
    return {
        "statusCode": 200,
        "bots": bots
        }


@app.post("/fine-tune")
async def fine_tune_model(request: FineTuneRequest):
    response = await configure_data( request.user_id, request.workspace_id,request.dataset_id)
    if response.status_code != 200:
        return {
            "statusCode" : response.status_code,
            "message" : "There was an error generating data for fine-tuning. Please verify if your dataset is well-formed"
            }
    else:
        job_id = await create_fine_tuning_job( file_id=data_id,input=request)

        return {
            "statusCode": 201,
            "message": "Fine-tuning process started",
            "fine_tuning_job_id": job_id.id
        }
        
    
@app.websocket("/chat")
async def chat(websocket: WebSocket):
    
    await websocket.accept()
    
    while True:
        data = await websocket.receive_text()
        print("user query : ",data)
        response = await openai.Completion.create(
            engine="davinci-003",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers user's query accurately"},
                {"role": "user", "content": data}
                ],
            # stream=True,
            # max_tokens=100,
        )
        print("response : ",response)
        async for chunk in response:
            if "choices" in chunk:
                delta = chunk.choices[0].delta
                if "content" in delta:
                    content = delta.content
                    print(content, end="")
                    await websocket.send_text(content)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=5000, log_level="debug",
                proxy_headers=True, reload=True)


# for fine tuning process. 
    # The flow will be the following
        # import dataset wrt dataset id 
        # check if data is jsonl form or anyother
        # other forms:
            # handling data based on format
            # pre processing pipeline - cleaning,correference resolution 
            # qa-generation
            
