import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
# from transformers import pipeline


def remove_irrelevant_pairs(qa_pairs):
    filtered_qa_pairs = []
    for qa in qa_pairs:
        question, answer = qa['Question'], qa['Answer']
        if not question.strip() or not answer.strip() or len(question.split()) < 3:
            continue
        if answer.endswith('...') or "please refer to" in answer.lower() or "for more information" in answer.lower():
            continue
        if not question[0].isalpha() or not answer[0].isalpha():
            continue
        filtered_qa_pairs.append(qa)
    return filtered_qa_pairs


def remove_redundant_pairs(qa_pairs, similarity_threshold=0.9):
    vectorizer = TfidfVectorizer().fit([qa['Question'] + " " + qa['Answer'] for qa in qa_pairs])
    qa_vectors = vectorizer.transform([qa['Question'] + " " + qa['Answer'] for qa in qa_pairs])

    similarity_matrix = cosine_similarity(qa_vectors)

    indices_to_remove = set()
    for i in range(len(qa_pairs)):
        for j in range(i+1, len(qa_pairs)):
            if similarity_matrix[i, j] > similarity_threshold:
                indices_to_remove.add(j)

    unique_qa_pairs = [pair for idx, pair in enumerate(qa_pairs) if idx not in indices_to_remove]
    return unique_qa_pairs


# def summarize_qa_pairs(qa_pairs):
#     summarizer = pipeline("summarization")
#     summarized_qa_pairs = []

#     for qa in qa_pairs:
#         question_length = len(qa['Question'].split())
#         answer_length = len(qa['Answer'].split())

#         summarized_question = summarizer(qa['Question'], max_length=question_length, min_length=3)[0]['summary_text']
#         summarized_answer = summarizer(qa['Answer'], max_length=answer_length, min_length=8)[0]['summary_text']

#         summarized_qa_pairs.append({'Question': summarized_question, 'Answer': summarized_answer})

#     return summarized_qa_pairs

