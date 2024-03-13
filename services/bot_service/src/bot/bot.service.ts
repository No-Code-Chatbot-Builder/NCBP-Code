import { Injectable } from '@nestjs/common';
import OpenAI from "openai";
import { DynamoDbService } from 'src/dynamo-db/dynamo-db.service';

@Injectable()
export class BotService {

    constructor(private dynamoDbService: DynamoDbService) 
    {

    }  
    
    async demo()
    {
        const openai = new OpenAI();
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "Can you tell me what exactly Compiler Construction is?" }],
            model: "gpt-3.5-turbo",
          });
        
          console.log(completion.choices[0]);
    }

    async createAssistant (){
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
      this.createMessage(myThread.id, "what is compiler construction", assistantId);
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

    async createMessage (threadId: string, assistantId: string, query: string, ) {
      const openai = new OpenAI();
      const myMessage = await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: query,
      });
    
      console.log(myMessage);
      this.createRun(threadId, assistantId, query);
    }


    async createRun (threadId: string, assistantId: string, query: string) {
      const openai = new OpenAI();
      const myRun = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        instructions: query,
      });
    
      this.createResponse(myRun.id, threadId, query, assistantId)
      console.log(myRun);
    }

    async createResponse(runId, threadId, query, assistantId) {
      const openai = new OpenAI();
      const interval = 1000; // Set the interval to 1 second (adjust as needed)
  
      while (true) { // Run indefinitely until completion
          const run = await openai.beta.threads.runs.retrieve(threadId, runId);
  
          if (run.status === 'completed') {
              const messagesFromThread = await openai.beta.threads.messages.list(threadId);
              console.log(messagesFromThread);
         
              return { runResult: run, messages: messagesFromThread }; // Resolve with result
          }  
          await new Promise(resolve => setTimeout(resolve, interval));
      }
  }


  //Only Assistant with Thread
  async createAssistantAndThread (instruction: string, workspace: string) {
    const openai = new OpenAI();
    const myAssistant = await openai.beta.assistants.create({
      instructions:
      instruction,
      name: "Math Tutor",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4",
    });
  
    console.log(myAssistant);
    this.createThreadForAssistant(myAssistant.id, workspace);
  }

  //Only Thread with Assistant
  async createThreadForAssistant (assistantId: string, workspace: string) {
    const createdAt = new Date().toISOString();
    const openai = new OpenAI();
    const myThread = await openai.beta.threads.create({});
    this.dynamoDbService.addData(workspace, assistantId, myThread.id, "userID", createdAt);
  
    console.log(myThread);
  }
}
