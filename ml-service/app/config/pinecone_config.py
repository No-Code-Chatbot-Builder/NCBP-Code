# import pinecone


# def get_data_from_pinecone(user_id,dataset_id,workspace_id):
   
#     pinecone.init(api_key="your_pinecone_api_key", environment="your_pinecone_environment")
#     index_name = "index_name"
#     index = pinecone.Index(index_name)
    
#     query = {
#         "filter": {
#             "user_id": {"$eq": user_id},
#             "dataset_id": {"$eq": dataset_id},
#             "workspace_id": {"$eq": workspace_id}
#         }
#     }
    
#     response = index.query(**query)
    
#     chunks = []
#     for match in response["matches"]:
#         text = match["metadata"]["text"]
#         chunks.append(text)

#     return {"chunks": chunks}