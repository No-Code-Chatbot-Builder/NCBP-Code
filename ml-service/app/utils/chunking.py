from transformers import pipeline
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document

#tested
async def file_processing(text):
    coref_pipeline = pipeline("coreference-resolution")
    result = coref_pipeline(text)
    splitter_ques_gen = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=50)
    chunks_ques_gen = splitter_ques_gen.split_text(result)
    document_ques_gen = [Document(page_content=t) for t in chunks_ques_gen]
    return document_ques_gen