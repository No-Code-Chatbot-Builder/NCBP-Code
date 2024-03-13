import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Gpt3Service } from './botDemo/botDemo.service';
import { AppService } from './app.service';
import { BotService } from './bot/bot.service';
import { DynamoDbService } from './dynamo-db/dynamo-db.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gpt3Service: Gpt3Service, // Inject Gpt3Service
    private readonly botService: BotService, // Inject BotServiceService
    private readonly dynamoDbService: DynamoDbService // Inject DynamoDbService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async handleQuery(@Body() body: { query: string }) {
    const { query } = body;
    const response = await this.gpt3Service.generateResponse(query);
    return { response };
  }


  @Post('/gpt')
  async handleQuery2() {
    const response = await this.botService.demo();
    return { response };
  }

  @Post('/api.openai.com/v1/assistants')
  async handleQuery4 (){
    const response = await this.botService.createAssistant();
    return { response };
  }

  @Get('/api.openai.com/v1/assistants')
  async handleQuery5 (){
    const response = await this.botService.ListAssistants();
    return { response };
  }

  @Get('/v1/assistants/:assistantId')
  async handleQuery6(@Param('assistantId') assistantId: string) {
    const response = await this.botService.retrieveAssistant(assistantId);
    return { response };
  }

  @Post('/v1/threads/:assistantId')
  async handleQuery7(@Param('assistantId') assistantId: string) {
    const response = await this.botService.createThread(assistantId);
    return { response };
  }


  @Get ('/v1/threads/:threadId')
  async handleQuery8(@Param('threadId') threadId: string) {
    const response = await this.botService.retrieveThread(threadId);
    return { response };
  }


  @Delete ('/v1/threads/:threadId')
  async handleQuery9(@Param('threadId') threadId: string) {
    const response = await this.botService.deleteThread(threadId);
    return { response };
  }

  @Post ('/v1/threads/:threadId/messages')
  async handleQuery10(@Param('threadId') threadId: string, @Body() body: { content: string, assistantId: string}) {
    const response = await this.botService.createMessage(threadId, body.content, body.assistantId);
    return { response };
  }

  @Post ('/v1/threads/:threadId/runs')
  async handleQuery11(@Param('threadId') threadId: string, @Body() body: { assistantId: string, instructions: string }) {
    const response = await this.botService.createRun(threadId, body.assistantId, body.instructions);
    return { response };
  }

  //Creating Assistant and Thread only
  @Post('/api.openai.com/v1/assistantsAndThreadOnly')
  async handleQuery12 (@Body() requestBody: { purpose: string, workspace: string }) {
    const {purpose, workspace } = requestBody;
    const response = await this.botService.createAssistantAndThread(purpose, workspace);
    return { response };
  }
  
   //Creating message and run only
   @Post('/api.openai.com/v1/runAndMessageOnly')
   async handleQuery13(@Body() requestBody: { threadId: string, assistantId: string, query: string }) {
     const { threadId, assistantId, query } = requestBody;
     const response = await this.botService.createMessage(threadId, assistantId, query);
     return { response };
   }

   //Sending workspace id to dynamoDb so that it fetches AssitantId and ThreadId to create msg and run
    @Post('/api.openai.com/v1/sendWorkspaceId') 
    async handleQuery14(@Body() requestBody: { workspaceId: string, query: string }) {
      const { workspaceId, query } = requestBody;
      const response = await this.dynamoDbService.sendWorkspaceId(workspaceId, query);
      return { response };
    }
}
