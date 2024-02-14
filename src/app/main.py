from fastapi import FastAPI,HTTPException,WebSocket
import openai
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from web_socket import html
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["backend url"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#This defines the response body 
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None



@app.get("/")
async def get():
    return HTMLResponse(html)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")

# @app.get("/")
# async def root():
#     return {"message": "Greetings from ML server!!"}


#path parameters
@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}


@app.post("/fine-tune")
async def fine_tune_model(training_file: str):
    try:
        response = openai.FineTune.create(
            training_file=training_file
        )
        return {"fine_tune_id": response["id"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
