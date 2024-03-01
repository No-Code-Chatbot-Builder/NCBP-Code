import json

def format_chat(row): 
    return json.dumps(
        {"messages": [
            {"role": "user", "content": row["prompt"]},
            {"role": "assistant", "content": str(row["response"])},
         ]}
    )


def convert_dataset(df, file_name):
    df["conversation"] = df.apply(format_chat, axis=1),
    with open(file_name, 'w') as jsonl_file:
        for example in df["conversation"]:
            jsonl_file.write(example + '\n')


