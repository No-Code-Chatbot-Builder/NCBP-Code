import json



async def merge_jsonl_data(jsonl_data1, jsonl_data2):
    if not jsonl_data1.endswith('\n'):
        jsonl_data1 += '\n'

    merged_jsonl_data = jsonl_data1 + jsonl_data2
    return merged_jsonl_data

#tested
async def convert_to_jsonl(qa_obj):
    jsonl_str = ""
    for item in qa_obj:
        formatted_chat = format_chat(item)
        jsonl_str += formatted_chat + "\n"
    return jsonl_str


#tested
def format_chat(row):
    return json.dumps(
        {"messages": [
            {"role": "user", "content": row["question"]},
            {"role": "assistant", "content": str(row["answer"])}
        ]}
    )

def convert_dataset(df, file_name):
    df["conversation"] = df.apply(format_chat, axis=1),
    with open(file_name, 'w') as jsonl_file:
        for example in df["conversation"]:
            jsonl_file.write(example + '\n')


