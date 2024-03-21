import requests
from bs4 import BeautifulSoup
import re

def web_scrap(urls):
    cleaned_texts = []
    for url in urls:
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            text = soup.get_text(separator=' ', strip=True)
            cleaned_text = clean_text(text)
            cleaned_texts.append(cleaned_text)
        else:
            print(f"Failed to fetch {url}")
    
    return cleaned_texts



def clean_text(text):
    text = re.sub(r"http\S+|www\S+|https\S+", '', text, flags=re.MULTILINE)
    text = re.sub(r'\W+|\d+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text