import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from "openai";
import { DynamoDbService } from 'src/dynamo-db/dynamo-db.service';
import { HttpService } from '@nestjs/axios';
import { Pinecone, QueryResponse } from '@pinecone-database/pinecone';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect  } from '@nestjs/websockets';
import { Server, Socket  } from 'socket.io';


@WebSocketGateway()
export class BotService implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() server: Server;
  private clientWorkspaceMap = new Map<string, string>(); // Map to associate client IDs with workspaceIds
  
    
    constructor(private dynamoDbService: DynamoDbService, private configService: ConfigService, private httpService: HttpService,) 
    {}


    async demo() {
        const openai = new OpenAI();
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "Can you tell me what exactly Compiler Construction is?" }],
            model: "gpt-3.5-turbo",
          });
          return (completion.choices[0]);
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
      stream.on('end', () => {
        this.server.emit('gptResponse', { event: 'streamEnded', data: 'Response ended' });
      });   
    }
    
  
  async getRaggedTextFromPineCone (query: number[], workspaceId: string) {
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
    const response =  queryResponse.matches[0].metadata.text 
      if (!response) {
        return '';
      } else {
        return response;
      }
}

  async initiateResponseProcess (workspaceId: string, query: string) {
    let context;
    let prompt;
    try {
      const response = await this.httpService
        .post('http://localhost:80/queryVectorEmbeddings', {
          text: query 
        })
        .toPromise(); 
        console.log("just hit langchain service")

      context = await this.getRaggedTextFromPineCone(response.data, workspaceId);
    } catch (error) {
      console.error('Error sending text to server:', error);
    }

    const data = await this.dynamoDbService.getAssistantRecord(workspaceId);
    if (!context || context.trim() === '') {
      prompt = "The following text is the query:\n" + query + ". If i are asked for code of anything, please give it inside the tags <code> and </code>";
    }
    else { 
    prompt = "The following text is the query:\n" + query  + "\n\nPlease answer while staying in the following context:\n" + context + ". If you are asked for code of anything, please give it inside the tags <code> and </code>";
    }
    console.log("prompt:", prompt)
    return(this.createMessage(data.datasets[0].threadId, data.datasets[0].assistantId, prompt));
  }


  //Only Assistant with Thread
  async createAssistant(instruction: string, workspace: string, userId: string, assistantName: string, tool: any, models: string) {
    const openai = new OpenAI();
    const myAssistant = await openai.beta.assistants.create({
      instructions: instruction,
      name: assistantName,
      tools: [{ type: tool }], // Now 'tool' is of type 'ToolType'
      model: models,
    });
  
  
  
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
      this.dynamoDbService.createAssistantRecord(workspace, assistantId, myThread.id, userId, createdAt, instruction);
    
      console.log(myThread);
      return myThread.id;
    } catch (error) {
      throw new Error(`Error creating thread for assistant: ${error.message}`);
    }
  }

  // Override the handleConnection method to capture workspaceId from the query string
  handleConnection(client: any, ...args: any[]): void {
    const workspaceId = client.handshake.query.workspaceId;
    if (workspaceId) {
      this.clientWorkspaceMap.set(client.id, workspaceId);
    }
  }

  // Override the handleDisconnect method to clean up the map on disconnect
  handleDisconnect(client: Socket): void {
    this.clientWorkspaceMap.delete(client.id);
  }

  @SubscribeMessage('runAssistant')
  async handleGptRequest(@ConnectedSocket() client: Socket, @MessageBody() rawData: any) {
    try {
      const data = JSON.parse(rawData);
      const query = data.query;
      const workspaceId = this.clientWorkspaceMap.get(client.id); // Get workspaceId from the map

      if (!workspaceId || !query) {
        console.error('Workspace ID or query is undefined!');
        this.server.to(client.id).emit('error', 'Workspace ID or query is undefined!');
        return;
      }
      
      // Rest of your logic...
      await this.initiateResponseProcess(workspaceId, query);
    } catch (error) {
      console.error('Error parsing data:', error);
      this.server.to(client.id).emit('error', `Error parsing data: ${error}`);
    }
  
  }
}






  
  // async createAssistantOnly () {
  //   const openai = new OpenAI();
  //   const myAssistant = await openai.beta.assistants.create({
  //     instructions:
  //       "What is compiler?",
  //     name: "Math Tutor",
  //     tools: [{ type: "code_interpreter" }],
  //     model: "gpt-4",
  //   });
  
  //   console.log(myAssistant);
  //   this.createThread(myAssistant.id);
  // }

  // async ListAssistants () {
  //   const openai = new OpenAI();
  //   const myAssistants = await openai.beta.assistants.list({
  //     limit: 1,
  //   });
  // console.log(myAssistants.data);
  // }

  // async retrieveAssistant(assistantId: string){
  //   const openai = new OpenAI();
  //   const myAssistant = await openai.beta.assistants.retrieve(assistantId);
  
  //   console.log(myAssistant);
  // }

  // async createThread (assistantId: string) {
  //   const openai = new OpenAI();
  //   const myThread = await openai.beta.threads.create({});
  
  //   console.log(myThread);
  //   this.createMessage(myThread.id,  assistantId, "what is compiler construction");
  // }

  // async retrieveThread (threadId: string) {
  //   const openai = new OpenAI();
  //   const myThread = await openai.beta.threads.retrieve(threadId);
  
  //   console.log(myThread);
  // }

  // async deleteThread (threadId: string) {
  //   const openai = new OpenAI();
  //   const myThread = await openai.beta.threads.del(threadId);
  
  //   console.log(myThread);
  // }

