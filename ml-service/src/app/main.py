from fastapi import FastAPI,HTTPException,WebSocket
import openai
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from app.middlewares.data import *
# from web_socket import html
from fastapi.middleware.cors import CORSMiddleware
import pathlib
from dotenv import load_dotenv
import os

base_dir = pathlib.Path(__file__).parent.parent.parent
load_dotenv(base_dir.joinpath('.env'))

class Config:
    S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

app = FastAPI()

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


@app.get("/")
async def root():
    return {"message": "Greetings from ML server!!"}
    
   

@app.post("/fine-tune")
async def fine_tune_model(request: FineTuneRequest):
    user_id = request.user_id
    dataset_id = request.dataset_id
    workspace_id = request.workspace_id

    items = await fetch_dataset_info(dataset_id)

    s3_keys = construct_s3_keys(items,user_id,workspace_id, dataset_id)

    await process_documents(s3_keys)


    return {"message": "Fine-tuning process started"}



# if __name__ == '__main__':
#     uvicorn.run("app.main:app", host="0.0.0.0", port=5000, log_level="info", reload=True)



# for fine tuning process. 
    # The flow will be the following
        # import dataset wrt dataset id 
        # check if data is jsonl form or anyother
        # other forms:
            # handling data based on format
            # pre processing pipeline - cleaning,correference resolution 
            # qa-generation
            
    
