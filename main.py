from fastapi import FastAPI,HTTPException
import openai

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Greetings from ML server!!"}


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