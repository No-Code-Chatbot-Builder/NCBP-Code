import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Gpt3Service } from './bot/bot.service';
import { AppService } from './app.service';
import { BotServiceService } from './bot_service/bot_service.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly gpt3Service: Gpt3Service, // Inject Gpt3Service
    private readonly botServiceService: BotServiceService, // Inject BotServiceService
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
    const response = await this.botServiceService.xyz();
    return { response };
  }

  @Post('/gpt2')
  async handleQuery3() {
    const response = await this.botServiceService.ABC();
    return { response };
  }

  @Post('/api.openai.com/v1/assistants')
  async handleQuery4 (){
    const response = await this.botServiceService.createAssistant();
    return { response };
  }

  @Get('/api.openai.com/v1/assistants')
  async handleQuery5 (){
    const response = await this.botServiceService.ListAssistants();
    return { response };
  }

  @Get('/v1/assistants/:assistantId')
  async handleQuery6(@Param('assistantId') assistantId: string) {
    const response = await this.botServiceService.retrieveAssistant(assistantId);
    return { response };
  }

  @Post('/v1/threads/:assistantId')
  async handleQuery7(@Param('assistantId') assistantId: string) {
    const response = await this.botServiceService.createThread(assistantId);
    return { response };
  }


  @Get ('/v1/threads/:threadId')
  async handleQuery8(@Param('threadId') threadId: string) {
    const response = await this.botServiceService.retrieveThread(threadId);
    return { response };
  }


  @Delete ('/v1/threads/:threadId')
  async handleQuery9(@Param('threadId') threadId: string) {
    const response = await this.botServiceService.deleteThread(threadId);
    return { response };
  }

  @Post ('/v1/threads/:threadId/messages')
  async handleQuery10(@Param('threadId') threadId: string, @Body() body: { content: string }) {
    const response = await this.botServiceService.createMessage(threadId, body.content);
    return { response };
  }


  @Post ('/v1/threads/:threadId/runs')
  async handleQuery11(@Param('threadId') threadId: string, @Body() body: { assistantId: string, instructions: string }) {
    const response = await this.botServiceService.createRun(threadId, body.assistantId, body.instructions);
    return { response };
  }
}
