import qa_pairs_generation 
import qa_optimizer
import json
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain.document_loaders import PyPDFLoader

def file_processing(file_path):
    loader = PyPDFLoader(file_path)
    data = loader.load()

    question_gen = ''
    for page in data:
        question_gen += page.page_content

    splitter_ques_gen = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks_ques_gen = splitter_ques_gen.split_text(question_gen)
    document_ques_gen = [Document(page_content=t) for t in chunks_ques_gen]

    return document_ques_gen


def llm_pipeline(file_path):

    document_ques_gen = file_processing(file_path)
    llm_ques_gen_pipeline = qa_pairs_generation.load_llm()
    llm_answer_gen_pipeline = qa_pairs_generation.load_llm()
    
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
        generated_questions = [qa_optimizer.clean_question(q.strip()) for q in generated_question.split("\n") if q.strip().endswith('?')]
        for question in generated_questions:
            prompt = prompt_template_a.format(text=document.page_content,question=question)
            generated_answer = qa_optimizer.clean_answer(llm_answer_gen_pipeline(prompt))
            questions.append(question)
            answers.append(generated_answer)
            print("Question : ",question,"\nAnswer : ", generated_answer)
            
        
    return questions, answers



def save_qa_to_jsonl(questions, answers, output_file_path):
    with open(output_file_path, "w", encoding="utf-8") as jsonlfile:
        for question, answer in zip(questions, answers):
            record = {"prompt": question, "completion": answer}
            jsonlfile.write(json.dumps(record) + "\n")
