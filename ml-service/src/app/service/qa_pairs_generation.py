from qa_model import Model
from qa_optimizer import *
import json
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from ctransformers import AutoModelForCausalLM
import spacy
import neuralcoref

def load_llm():
    return AutoModelForCausalLM.from_pretrained("TheBloke/Mistral-7B-Instruct-v0.1-GGUF", model_file="mistral-7b-instruct-v0.1.Q4_K_M.gguf", model_type="mistral", gpu_layers=50)

def file_processing(text):
    nlp = spacy.load('en_core_web_md') 
    neuralcoref.add_to_pipe(nlp)
    doc = nlp(text)
    doc = doc._.coref_resolved
    splitter_ques_gen = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks_ques_gen = splitter_ques_gen.split_text(doc)
    document_ques_gen = [Document(page_content=t) for t in chunks_ques_gen]

    return document_ques_gen


def llm_pipeline(document_ques_gen):
    # document_ques_gen = file_processing(file_path)
    llm_ques_gen_pipeline = Model.load_llm()
    llm_answer_gen_pipeline = Model.load_llm()
    
    prompt_template_q = """
    You are an expert at creating comprehensive questions based on the text delimited by triple back-ticks.
    Your task is to formulate questions that encompass all aspects and details of text delimited by triple back-ticks , 
    ensuring no significant part is missed. Your questions should be thorough and cover the entire text delimited by triple back-ticks.

    --------------
    ```{text}```
    --------------

    Create comprehensive and non-redundant questions that explore every part of the text delimited by triple back-ticks only.
    QUESTIONS:
    """
    
    prompt_template_a = """
    You are an expert at creating brief answer based on question provided from the text delimited 
    by triple back-ticks.
    Your task is to formulate answer that encompass all aspects and details of text delimited by triple back-ticks 
    and the question provided, 
    
    --------------
    ```{text}```
    --------------
    
    Question: {question}
    
    Create brief answer that is inspired by the text delimited by triple back-ticks only.
    Answer:
    """
    
    questions = []   
    answers = []
    
    for document in document_ques_gen:
        prompt = prompt_template_q.format(text=document.page_content)
        generated_question = llm_ques_gen_pipeline(prompt)
        generated_questions = [clean_question(q.strip()) for q in generated_question.split("\n") if q.strip().endswith('?')]
        for question in generated_questions:
            prompt = prompt_template_a.format(text=document.page_content,question=question)
            generated_answer = clean_answer(llm_answer_gen_pipeline(prompt))
            questions.append(question)
            answers.append(generated_answer)
            print("Question : ",question,"\nAnswer : ", generated_answer)
            
        
    return questions, answers


