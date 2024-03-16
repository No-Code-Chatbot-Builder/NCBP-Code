from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import CharacterTextSplitter
from typing import List

app = FastAPI()

class Texts(BaseModel):
    texts: List[str]

class TextModel(BaseModel):  # Define a Pydantic model that matches the expected JSON structure
    text: str

@app.post("/vectorEmbeddings")
def create_vector_embeddings(texts: Texts):
   
    
    splitter = CharacterTextSplitter(separator='\n', chunk_size=1000, chunk_overlap=200)
    
    splitted_documents = []
    for text in texts.texts:
        splitted_documents.extend(splitter.split_text(text))

    
    # lit each document and flatten the list
    """    splitted_documents = []
        for text in texts.texts:
            # For each text, use the splitter to split it into chunks
            chunks = splitter.split_documents(text)
            for chunk in chunks:
                # Add each chunk to the list of splitted documents
                splitted_documents.append(chunk)
    """
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Encoding the splitted documents
    embeddings = model.encode(splitted_documents)

    # Convert numpy arrays to Python lists for JSON serialization
    embeddings_as_lists = [embedding.tolist() for embedding in embeddings]
    
    
    return {"embeddings": embeddings_as_lists}, {"splitted_documents": splitted_documents}


  

@app.post("/queryVectorEmbeddings")
def createQueryVectorEmbeddings(text: TextModel):
    
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Encoding the splitted documents
    embeddings = model.encode([text.text])

    embeddings_as_lists = [embedding.tolist() for embedding in embeddings]
    
    return embeddings_as_lists[0]
    

    




@app.get("/")
def read_root():
    return {"Hello": "World"}

