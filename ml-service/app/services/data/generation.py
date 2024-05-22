import os
import requests
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

class Config:
    HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY')
    MISTRAL_API_KEY = os.getenv('MISTRAL_API_KEY')
    model = "mistral-large-latest"

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

async def generate_from_huggingface(prompt, api_key):
    client = MistralClient(api_key=Config.MISTRAL_API_KEY)
    messages = [
        ChatMessage(role="user", content=prompt)
    ]
    chat_response = client.chat(
        model=Config.model,
        messages=messages,
    )
    print(chat_response.choices[0].message.content)
    return chat_response.choices[0].message.content


    headers = {
        "Authorization": f"Bearer {api_key}"
    }
    response = requests.post(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        headers=headers,
        json={"inputs": prompt}
    )
    if response.status_code == 200:
        return response.json()[0]['generated_text']
    else:
        raise Exception(f"Error: {response.status_code}, {response.text}")
    
    
def extract_questions(generated_text):
    if "QUESTIONS:" in generated_text:
        questions_part = generated_text.split("QUESTIONS:")[-1]
        questions = questions_part.strip().split("\n")
    else:
        questions = []

    cleaned_questions = []
    for question in questions:
        if question.strip() and question.strip()[0].isdigit():
            cleaned_question = question.split('.', 1)[-1].strip()
            if cleaned_question:
                cleaned_questions.append(cleaned_question)
    return cleaned_questions

def extract_answer(generated_text):
    capturing = False
    answer = []
    lines = generated_text.split("\n")
    for line in lines:
        if 'Answer:' in line:
            capturing = True
            answer.append(line.split('Answer:', 1)[1].strip())
            continue
        if capturing:
            if line.strip() == "" or line.strip().startswith('```'):
                break
            answer.append(line.strip())
    return ' '.join(answer)


#tested
async def llm_pipeline(chunks):
    i = 0
    api_key = Config.HUGGINGFACE_API_KEY
    if not api_key:
        raise ValueError("HuggingFace API key is not set.")
    
    qa_pairs = []
    
    for document in chunks:
        prompt = prompt_template_q.format(text=document.page_content)
        generated_question_text = await generate_from_huggingface(prompt, api_key)
        generated_questions = extract_questions(generated_question_text)
        for question in generated_questions:
            i+=1
            prompt = prompt_template_a.format(text=document.page_content, question=question)
            generated_answer_text = await generate_from_huggingface(prompt, api_key)
            # print("generated answer------------\n",generated_answer_text)
            answer = extract_answer(generated_answer_text)
            qa_pairs.append({"question": question, "answer": answer})
            print("\n\njson pair------\n",{"question": question, "answer": answer})
            if i == 20:
                return qa_pairs
    return qa_pairs
