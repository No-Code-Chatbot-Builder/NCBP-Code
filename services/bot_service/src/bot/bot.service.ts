//import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { DynamoDbService } from 'src/dynamo-db/dynamo-db.service';
import { HttpService } from '@nestjs/axios';
import { Pinecone, QueryResponse } from '@pinecone-database/pinecone';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import path from 'path';

@WebSocketGateway({ path: '/bot/socket.io' })
export class BotService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clientWorkspaceMap: Map<
    string,
    { workspaceId: string; assistantId: string }
  > = new Map(); // Map to associate client IDs with workspaceIds

  constructor(
    private dynamoDbService: DynamoDbService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async demo() {
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Can you tell me what exactly Compiler Construction is?',
        },
      ],
      model: 'gpt-3.5-turbo',
    });
    return completion.choices[0];
  }

  async createMessage(threadId: string, assistantId: string, query: string) {
    const openai = new OpenAI();
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: query,
    });
    return this.createRunAndStream(threadId, assistantId, query);
  }

  async createRunAndStream(
    threadId: string,
    assistantId: string,
    query: string,
  ) {
    const openai = new OpenAI();
    const stream = openai.beta.threads.runs.createAndStream(threadId, {
      assistant_id: assistantId,
      instructions: query,
    });

    stream.on('textCreated', (text) => {
      this.server.emit('gptResponse', { event: 'textCreated', data: text });
    });

    stream.on('textDelta', (textDelta, snapshot) => {
      this.server.emit('gptResponse', {
        event: 'textDelta',
        data: textDelta.value,
      });
    });

    stream.on('toolCallCreated', (toolCall) => {
      this.server.emit('gptResponse', {
        event: 'toolCallCreated',
        data: toolCall,
      });
    });

    stream.on('toolCallDelta', (toolCallDelta, snapshot) => {
      if (toolCallDelta.type === 'code_interpreter') {
        const outputData = {
          input: toolCallDelta.code_interpreter.input,
          outputs: toolCallDelta.code_interpreter.outputs,
        };
        this.server.emit('gptResponse', {
          event: 'toolCallDelta',
          data: outputData,
        });
      }
    });
    stream.on('end', () => {
      this.server.emit('gptResponse', {
        event: 'streamEnded',
        data: 'Response ended',
      });
    });
  }

  async getRaggedTextFromPineCone(
    query: number[],
    workspaceId: string,
    dataSetId: string,
  ) {
    const apiKey: string = this.configService.get<string>('PINECONE_API_KEY');
    const pineCone: Pinecone = new Pinecone({ apiKey: apiKey });
    const index = pineCone.index('test');

    const queryResponse: QueryResponse = await index.query({
      vector: query,
      topK: 1,
      includeMetadata: true,
      filter: {
        workspaceId: workspaceId,
        dataSetId: dataSetId,
      },
    });

    const response = queryResponse?.matches[0]?.metadata?.text;
    if (!response) {
      return '';
    } else {
      return response;
    }
  }

  async initiateResponseProcess(
    workspaceId: string,
    assistantId: string,
    query: string,
  ) {
    let context;
    let prompt;
    const data = await this.dynamoDbService.getAssistantRecord2(
      workspaceId,
      assistantId,
    );
    try {
      const response = await this.httpService
        .post('http://langchain-embedding-service.services/queryVectorEmbeddings', {
          text: query,
        })
        .toPromise();
      console.log('just hit langchain service');
      console.log(response);

      context = await this.getRaggedTextFromPineCone(
        response.data,
        workspaceId,
        data.data[0].dataSetId,
      );
    } catch (error) {
      console.error('Error sending text to server:', error);
    }

    if (!context || context.trim() === '') {
      prompt =
        'The following text is the query:\n' +
        query +
        '. If your answer includes code, please enclose it inside the tags <code> and </code>';
    } else {
      prompt =
        'The following text is the query:\n' +
        query +
        '\n\nPlease answer while staying in the following context:\n' +
        context +
        '. If your answer includes code, please enclose it inside the tags <code> and </code>';
    }
    console.log("prompt:", prompt)
    return this.createMessage(
      data.data[0].threadId,
      data.data[0].assistantId,
      prompt,
    );
  }

  //Only Assistant with Thread
  async createAssistant(
    instruction: string,
    workspace: string,
    userId: string,
    assistantName: string,
    tool: any,
    models: string,
    dataSetId: string,
  ) {
    const openai = new OpenAI();
    const Assistant = await openai.beta.assistants.create({
      instructions: instruction,
      name: assistantName,
      tools: [{ type: tool }], // Now 'tool' is of type 'ToolType'
      model: models,
    });

    const threadId = await this.createThread(
      Assistant.id,
      workspace,
      userId,
      instruction,
      dataSetId,
      assistantName,
    );
    return [
      'success: True',
      'message: Assistant and thread created successfully',
      'assistantId: ' + Assistant.id,
      'threadId: ' + threadId,
    ];
  }
  catch(error) {
    throw new Error(`Error while creating assistant: ${error.message}`);
  }

  //Only Thread with Assistant
  async createThread(
    assistantId: string,
    workspace: string,
    userId: string,
    instruction: string,
    dataSetId: string,
    assistantName: string,
  ) {
    try {
      const createdAt = new Date().toISOString();
      const openai = new OpenAI();
      const myThread = await openai.beta.threads.create({});
      this.dynamoDbService.createAssistantRecord(
        workspace,
        assistantId,
        myThread.id,
        userId,
        createdAt,
        instruction,
        dataSetId,
        assistantName,
      );

      console.log(myThread);
      return myThread.id;
    } catch (error) {
      console.error(`Error while creating assistant: ${error.message}`);
      return ['success: False', 'message: Error creating assistant'];
    }
  }

  async softDeleteOfBot(
    workspaceId: string,
    assistantId: string,
  ): Promise<any> {
    let currentData;
    try {
      const getResult = await this.dynamoDbService.getAssistantRecord2(
        workspaceId,
        assistantId,
      );
      currentData = getResult;
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw new Error('Unable to retrieve data: ');
    }

    // If the data is already marked as deleted, we return an appropriate message.
    if (currentData !== null && currentData !== undefined) {
      if (
        currentData?.deletedAt !== null &&
        currentData?.data[0]?.deletedAt !== undefined
      ) {
        return {
          success: false,
          message: 'Bot is already marked as deleted.',
          deletedAt: currentData.deletedAt,
        };
      } else {
        try {
          const deletionRecord = await this.dynamoDbService.deletion(
            workspaceId,
            assistantId,
          );
          return deletionRecord.Item;
        } catch (error) {
          console.error('Error deleting bot:', error);
          throw new Error('Unable to delete bot.');
        }
      }
    }
  }

  async gettingThreadIdForMessages(
    workspaceId: string,
    assistantId: string,
  ): Promise<any> {
    const result = await this.dynamoDbService.getAssistantRecord2(
      workspaceId,
      assistantId,
    );
    this.getAllMessages(result.threadId);
  }

  async getAllMessages(threadId: string): Promise<any> {
    const openai = new OpenAI();
    const threadMessages = await openai.beta.threads.messages.list(threadId);

    console.log(threadMessages.data);
  }

  async getAllAssistants(workspaceId: string): Promise<any> {
    return await this.dynamoDbService.getAllAssistant(workspaceId);
  }

  // Override the handleConnection method to capture workspaceId from the query string
  handleConnection(client: any, ...args: any[]): void {
    const workspaceId = client.handshake.query.workspaceId;
    const assistantId = client.handshake.query.assistantId;

    if (workspaceId && assistantId) {
      this.clientWorkspaceMap.set(client.id, { workspaceId, assistantId });
    }
  }

  // Override the handleDisconnect method to clean up the map on disconnect
  handleDisconnect(client: Socket): void {
    this.clientWorkspaceMap.delete(client.id);
  }

  @SubscribeMessage('runAssistant')
  async handleUserRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() rawData: any,
  ) {
    try {
      const data = JSON.parse(rawData);
      const query = data.query;
      const { workspaceId, assistantId } = this.clientWorkspaceMap.get(
        client.id,
      );

      if (!workspaceId || !assistantId || !query) {
        console.error('Workspace ID, assistant ID, or query is undefined!');
        this.server
          .to(client.id)
          .emit('error', 'Workspace ID, assistant ID, or query is undefined!');
        return;
      }

      await this.initiateResponseProcess(workspaceId, assistantId, query);
    } catch (error) {
      console.error('Error parsing data:', error);
      this.server.to(client.id).emit('error', `Error parsing data: ${error}`);
    }
  }
}

//// async createAssistantOnly () {
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
