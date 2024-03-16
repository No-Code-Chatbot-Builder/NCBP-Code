import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from "openai";
import { DynamoDbService } from 'src/dynamo-db/dynamo-db.service';

@Injectable()
export class BotService {

    constructor(private dynamoDbService: DynamoDbService, private configService: ConfigService) 
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
    
      console.log(myMessage);
      return(this.createRun(threadId, assistantId, query));
    }


    async createRun (threadId: string, assistantId: string, query: string) {
      const openai = new OpenAI();
      const myRun = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        instructions: query,
      });

      console.log(myRun);
    
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

  async fetchingInfo (workspaceId: string, query: string) {
    const data = await this.dynamoDbService.fetchingData(workspaceId);
    //console.log(data.datasets[0].assistantId);
    //console.log(data.datasets[0].threadId);
    //console.log(query);
    return(this.createMessage(data.datasets[0].threadId, data.datasets[0].assistantId, query));
  }


  //Only Assistant with Thread
  async createAssistant (instruction: string, workspace: string, userId: string) {
    const openai = new OpenAI();
    const myAssistant = await openai.beta.assistants.create({
      instructions:
      instruction,
      name: "Math Tutor",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4",
    });
  
    console.log(myAssistant);
    this.createThreadForAssistant(myAssistant.id, workspace, userId);
  }

  //Only Thread with Assistant
  async createThreadForAssistant (assistantId: string, workspace: string, userId: string) {
    const createdAt = new Date().toISOString();
    const openai = new OpenAI();
    const myThread = await openai.beta.threads.create({});
    this.dynamoDbService.addData(workspace, assistantId, myThread.id, userId, createdAt);
  
    console.log(myThread);
  }
}
