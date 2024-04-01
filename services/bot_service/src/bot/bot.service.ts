import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from "openai";
import { DynamoDbService } from 'src/dynamo-db/dynamo-db.service';
import { HttpService } from '@nestjs/axios';
import { Pinecone, QueryResponse } from '@pinecone-database/pinecone';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class BotService {
  @WebSocketServer() server: Server;

    constructor(private dynamoDbService: DynamoDbService, private configService: ConfigService, private httpService: HttpService,) 
    {}  
    
    async demo() {
      console.log("hello")
        const openai = new OpenAI();
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "Can you tell me what exactly Compiler Construction is?" }],
            model: "gpt-3.5-turbo",
          });

          console.log(completion.choices[0]);
          return (completion.choices[0]);
        }

    async createAssistantOnly () {
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

    async ListAssistants () {
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
      return(this.createRunAndStream(threadId, assistantId, query));
    }

    async createRunAndStream(threadId: string, assistantId: string, query: string) {
      const openai = new OpenAI();
      const stream = openai.beta.threads.runs.createAndStream(threadId, {
        assistant_id: assistantId,
        instructions: query,
      });
    
      stream.on('textCreated', (text) => {
        this.server.emit('gptResponse', { event: 'textCreated', data: text });
      });
    
      stream.on('textDelta', (textDelta, snapshot) => {
        this.server.emit('gptResponse', { event: 'textDelta', data: textDelta.value });
      });
    
      stream.on('toolCallCreated', (toolCall) => {
        this.server.emit('gptResponse', { event: 'toolCallCreated', data: toolCall });
      });
    
      stream.on('toolCallDelta', (toolCallDelta, snapshot) => {
        if (toolCallDelta.type === 'code_interpreter') {
          const outputData = {
            input: toolCallDelta.code_interpreter.input,
            outputs: toolCallDelta.code_interpreter.outputs,
          };
          this.server.emit('gptResponse', { event: 'toolCallDelta', data: outputData });
        }
      });
    }
    
  
  async fetchPineconeMatchText (query: number[], workspaceId: string) {
    const apiKey: string = this.configService.get<string>('PINECONE_API_KEY');
    const pc: Pinecone = new Pinecone({ apiKey: apiKey });
    const index = pc.index("test");

    const queryResponse: QueryResponse = await index.query({
        vector: query,
        topK: 1,
        includeMetadata: true,
        filter: {
          workspaceId: workspaceId 
        }
    });
    //console.log("query response", queryResponse.matches[0].metadata.text);
    return queryResponse.matches[0].metadata.text;
}

  async initiateResponseProcess (workspaceId: string, query: string) {
    let context;

    try {
      const response = await this.httpService
        .post('http://localhost:80/queryVectorEmbeddings', {
          text: query 
        })
        .toPromise(); 

    console.log("response", response)
      context = await this.fetchPineconeMatchText(response.data, workspaceId);
    } catch (error) {
      console.error('Error sending text to server:', error);
    }
    const data = await this.dynamoDbService.fetchingDataFromDB(workspaceId);
    const prompt = "The following text is the query:\n" + query  + "\n\nPlease answer while staying in the following context:\n" + context;
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

    return ["success: True","message: Assistant and thread created successfully", "assistantId: " + myAssistant.id, "threadId: " + threadId];
  } catch (error) {
    throw new Error(`Error creating assistant: ${error.message}`);
  }
  

  //Only Thread with Assistant
  async createThreadForAssistant (assistantId: string, workspace: string, userId: string, instruction: string) {
    try {
      const createdAt = new Date().toISOString();
      const openai = new OpenAI();
      const myThread = await openai.beta.threads.create({});
      this.dynamoDbService.addDataToDB(workspace, assistantId, myThread.id, userId, createdAt, instruction);
    
      console.log(myThread);
      return myThread.id;
    } catch (error) {
      throw new Error(`Error creating thread for assistant: ${error.message}`);
    }
  }

  @SubscribeMessage('botService')
  async handleGptRequest(@MessageBody() rawData: any) {
    try {
      const data = JSON.parse(rawData);
      console.log("Received data:", data);
      const workspaceId = data.workspaceId;
      const query = data.query;

      if (!workspaceId || !query) {
        console.error('Field is undefined!');
        return;
      }
      
      this.initiateResponseProcess(workspaceId, query);
    } catch (error) {
      console.error('Error parsing data:', error);
    }
  }
}
