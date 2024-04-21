import { Controller, Get, Post, Body, Param, Delete, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { BotService } from './bot/bot.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly botService: BotService,

  ) {}

  //Creating Assistant and Thread only. It also adds into dynamoDB
  @Post('/bot/:workspaceId/assistant')
  async createAssistantAndThread (@Param('workspaceId') workspaceId: string, @Req() req: Request, @Body() requestBody: { purpose: string, assistantName: string, tool: any, models: string, dataSetId: string}) {
    const {purpose, assistantName, tool, models, dataSetId} = requestBody;
    const userId = req['user'].id;
    const response = await this.botService.createAssistant(purpose, workspaceId, userId, assistantName, tool, models, dataSetId);
    return { response };
  }
  //Connection check
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('/bot/health')
  getHealth(): string {
    return "Bot Service is working";
  }


    //Creating Assistant and Thread only. It also adds into dynamoDB
    @Delete('/bot/:workspaceId')
    async DeleteOfBot (@Param('workspaceId') workspaceId: string, @Body() requestBody: {assistantId: string}) {
      const {assistantId} = requestBody;
      const response = await this.botService.softDeleteOfBot(workspaceId, assistantId);
      return { response };
    }

    @Get('/bot/:workspaceId')
    async getAllAssistant (@Param('workspaceId') workspaceId: string) {
      //const {assistantId} = requestBody;
      const response = await this.botService.getAllAssistants(workspaceId);
      return { response };
    }


   //Sending workspace id to dynamoDb so that it fetches AssitantId and ThreadId to create msg and run
  //  @Post('/bot/:workspaceId/runAssistant')
  //  async runAssistant (@Param('workspaceId') workspaceId: string,  @Req() req: Request, @Body() requestBody: { query: string }) {
  //    const { query } = requestBody;
  //    const response = await this.botService.initiateResponseProcess(workspaceId, query);
  //    return { response };
  //  }

  // //Demo
  // @Post('/gpt')
  // async handleQuery2() {
  //   const response = await this.botService.demo();
  //   return { response };
  // }

//   //Create Assistant - complete cycle in one go 
//   //This API will create assistant, thread, message, and run, all in one go
//   @Post('/createAssistant')
//   async handleQuery4 (){
//     const response = await this.botService.createAssistantOnly();
//     return { response };
//   }

// //List all Assistants
//   @Get('/listAllAssistants')
//   async handleQuery5 (){
//     const response = await this.botService.ListAssistants();
//     return { response };
//   }

//   //Retrieve a specific Assistant
//   @Get('/retrieveAssistant')
//   async handleQuery6(@Body() body: { assistantId: string }) {
//     const { assistantId } = body;
//     const response = await this.botService.retrieveAssistant(assistantId);
//     return { response };
//   }

// //Create Thread. This will create thread, message, and run because its calling the same API 
// //which is used to create assistant, thread, message, and run in one go
//   @Post('/createThread')
//   async handleQuery7(@Body() body: { assistantId: string }) {
//     const { assistantId } = body;
//     const response = await this.botService.createThread(assistantId);
//     return { response };
//   }

// //Retrieve a specific Thread with its details
//   @Get ('/retrieveThread')
//   async handleQuery8(@Body() body: { threadId: string }) {
//     const { threadId } = body;
//     const response = await this.botService.retrieveThread(threadId);
//     return { response };
//   }

// //Deletes a specific Thread
//   @Delete ('/deleteThread')
//   async handleQuery9(@Body() body: { threadId: string }) {
//     const { threadId } = body;
//     const response = await this.botService.deleteThread(threadId);
//     return { response };
//   }

//   //Create message with run 
//   @Post ('/createMessage')
//   async handleQuery10(@Body() body: { threadId, assistantId: string, query: string}) {
//     const response = await this.botService.createMessage(body.threadId, body.assistantId, body.query);
//     return { response };
//   }

//   //Create Run
//   @Post ('/createRun')
//   async handleQuery11(@Body() body: { threadId: string, assistantId: string, query: string}) {
//     const response = await this.botService.createRun(body.threadId, body.assistantId, body.query);
//     return { response };
//   }

//       //Creating message and run only
//       @Post('/runAndMessageOnly')
//       async handleQuery13(@Body() requestBody: { threadId: string, assistantId: string, query: string }) {
//         const { threadId, assistantId, query } = requestBody;
//         const response = await this.botService.createMessage(threadId, assistantId, query);
//         return { response };
//       }
   
}
