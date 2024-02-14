from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

app = FastAPI()

class Texts(BaseModel):
    texts: list[str]  # Using the built-in generic type

@app.post("/embed")
def create_vector_embeddings(texts: Texts):
    
    print("Creating embeddings")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    # Access the list of texts with texts.texts
    return model.encode(texts.texts).tolist()


@app.get("/")
def read_root():
    return {"Hello": "World"}

