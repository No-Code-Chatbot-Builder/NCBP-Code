import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from "openai";
import { DynamoDbService } from 'src/dynamo-db/dynamo-db.service';
import { HttpService } from '@nestjs/axios';
import { Pinecone, QueryResponse } from '@pinecone-database/pinecone';

@Injectable()
export class BotService {
  
    constructor(private dynamoDbService: DynamoDbService, private configService: ConfigService, private httpService: HttpService,) 
    {
        
    }  
    
    async demo()
    {
        const openai = new OpenAI();
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "Can you tell me what exactly Compiler Construction is?" }],
            model: "gpt-3.5-turbo",
          });
        
          return (completion.choices[0]);
          //console.log(completion.choices[0]);
    }

    async createAssistantOnly (){
      const openai = new OpenAI();
      const myAssistant = await openai.beta.assistants.create({
        instructions:
          "What is compiler?",
        name: "Math Tutor",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4",
      });
    
      console.log(myAssistant);
      this.createThread(myAssistant.id);
    }

    async ListAssistants (){
      const openai = new OpenAI();
      const myAssistants = await openai.beta.assistants.list({
        limit: 1,
      });
    
      console.log(myAssistants.data);
    }

    async retrieveAssistant(assistantId: string){
      const openai = new OpenAI();
      const myAssistant = await openai.beta.assistants.retrieve(assistantId);
    
      console.log(myAssistant);
    }

    async createThread (assistantId: string) {
      const openai = new OpenAI();
      const myThread = await openai.beta.threads.create({});
    
      console.log(myThread);
      this.createMessage(myThread.id,  assistantId, "what is compiler construction");
    }

    async retrieveThread (threadId: string) {
      const openai = new OpenAI();
      const myThread = await openai.beta.threads.retrieve(threadId);
    
      console.log(myThread);
    }

    async deleteThread (threadId: string) {
      const openai = new OpenAI();
      const myThread = await openai.beta.threads.del(threadId);
    
      console.log(myThread);
    }

    async createMessage (threadId: string, assistantId: string, query: string) {
      const openai = new OpenAI();
      const myMessage = await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: query,
      });
    
      //console.log(myMessage);
      return(this.createRun(threadId, assistantId, query));
    }


    async createRun (threadId: string, assistantId: string, query: string) {
      const openai = new OpenAI();
      const myRun = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        instructions: query,
      });

     // console.log(myRun);
    
      return(this.createResponse(myRun.id, threadId));
    }

    async createResponse(runId, threadId) {
      const openai = new OpenAI();
      const interval = 1000; // Set the interval to 1 second (adjust as needed)
  
      while (true) { // Run indefinitely until completion
          const run = await openai.beta.threads.runs.retrieve(threadId, runId);
  
          if (run.status === 'completed') {
              const messagesFromThread = await openai.beta.threads.messages.list(threadId);
              return(messagesFromThread.data[0].content[0]["text"]["value"]);
          }  
          await new Promise(resolve => setTimeout(resolve, interval));
      }
  }

  
  async pineConeEmbeddingOfQuery (query: number[]) {
    const apiKey: string = this.configService.get<string>('PINECONE_API_KEY');
    const pc: Pinecone = new Pinecone({ apiKey: apiKey });
    const index = pc.index("test");

    const queryResponse: QueryResponse = await index.query({
        vector: query,
        topK: 1,
        includeMetadata: true,
    });

    //console.log("query response", queryResponse.matches[0].metadata.text);
    return queryResponse.matches[0].metadata.text;
}

  async fetchingAssistantIdFromDynamoDB (workspaceId: string, query: string) {

    let context;

    try {
      const response = await this.httpService
        .post('http://localhost:80/langchain-embedding-service.services/queryVectorEmbeddings', {
          text: query // Replace with actual texts
        })
        .toPromise(); // Convert Observable to Promise

      //this.pineconeService.upsertRecords(response.data, userId, workspaceId, datasetId);
      //console.log(response)
      context = await this.pineConeEmbeddingOfQuery(response.data);
    } catch (error) {
      console.error('Error sending text to server:', error);
    }
    const data = await this.dynamoDbService.fetchingDataFromDynamoDB(workspaceId);
    const prompt = "The following text is the query:\n" + query  + "\n\nPlease answer while staying in the following context:\n" + context
    //console.log(prompt)
    //console.log(data.datasets[0].assistantId);
    //console.log(data.datasets[0].threadId);
    //console.log(query);
    return(this.createMessage(data.datasets[0].threadId, data.datasets[0].assistantId, prompt));
  }


  //Only Assistant with Thread
  async createAssistant (instruction: string, workspace: string, userId: string) {
    const openai = new OpenAI();
    const myAssistant = await openai.beta.assistants.create({
      instructions: instruction,
      name: "Generic Assistant",
      tools: [{ type: "retrieval"}],
      model: "gpt-3.5-turbo",
    });
  
    console.log(myAssistant);
    const threadId = await this.createThreadForAssistant(myAssistant.id, workspace, userId, instruction);
  
    // Return an array containing both assistant ID and thread ID
    return ["success: True","message: Assistant and thread created successfully", "assistantId: " + myAssistant.id, "threadId: " + threadId];
  } catch (error) {
    // Handle errors if any
    throw new Error(`Error creating assistant: ${error.message}`);
  }
  

  //Only Thread with Assistant
  async createThreadForAssistant (assistantId: string, workspace: string, userId: string, instruction: string) {
    try {
      const createdAt = new Date().toISOString();
      const openai = new OpenAI();
      const myThread = await openai.beta.threads.create({});
      this.dynamoDbService.addDataToDynamoDB(workspace, assistantId, myThread.id, userId, createdAt, instruction);
    
      console.log(myThread);
      return myThread.id;
    } catch (error) {
      // Handle errors if any
      throw new Error(`Error creating thread for assistant: ${error.message}`);
    }
  }
}
