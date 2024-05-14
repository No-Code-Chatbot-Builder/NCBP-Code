from app.services.data import *
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
# from ctransformers import AutoModelForCausalLM
from langchain_community.llms import HuggingFaceEndpoint
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
from app.services.data.optimizer import *
# import spacy
# import neuralcoref


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

    
def load_llm():
    # return AutoModelForCausalLM.from_pretrained("TheBloke/Mistral-7B-Instruct-v0.1-GGUF", model_file="mistral-7b-instruct-v0.1.Q4_K_M.gguf", model_type="mistral", gpu_layers=50)
    repo_id = "mistralai/Mistral-7B-Instruct-v0.2"
    llm = HuggingFaceEndpoint(
        repo_id=repo_id, max_length=128, temperature=0.5, token="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"
    )
    return llm;




def llm_pipeline(document_ques_gen):
    llm_ques_gen_pipeline = load_llm()
    llm_answer_gen_pipeline = load_llm()
    
    questions = []   
    answers = []
    
    for document in document_ques_gen:
        # prompt = prompt_template_q.format(text=document.page_content)
        prompt = PromptTemplate.from_template(prompt_template_q)
        llm = llm_ques_gen_pipeline()
        llm_chain = LLMChain(prompt=prompt, llm=llm)
        generated_question = llm_chain.run({'text' : document.page_content})
        generated_questions = [clean_question(q.strip()) for q in generated_question.split("\n") if q.strip().endswith('?')]
        for question in generated_questions:
            prompt = prompt_template_a.format(text=document.page_content,question=question)
            generated_answer = clean_answer(llm_answer_gen_pipeline(prompt))
            questions.append(question)
            answers.append(generated_answer)
            print("Question : ",question,"\nAnswer : ", generated_answer)
            
        
    return questions, answers


