import { Injectable } from '@nestjs/common';
import { get } from 'http';
import OpenAI from "openai";

import os from "os";

@Injectable()
export class BotServiceService {
    constructor(){

    }
    async xyz()
    {
        const openai = new OpenAI();
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "Can you tell me what exactly Compiler Construction is?" }],
            model: "gpt-3.5-turbo",
          });
        
          console.log(completion.choices[0]);

    }

    async getAnswer(question: string) {
      const openai = new OpenAI();
      const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: question }],
          model: "gpt-3.5-turbo",
        });
      
        console.log(completion.choices[0]);
  }


    async ABC (){
      const openai = new OpenAI();
      const assistant = await openai.beta.assistants.create({
        name: "Math Tutor",
        instructions: "You are a personal math tutor. Write and run code to answer math questions.",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4-turbo-preview"
      });


      const thread = await openai.beta.threads.create();

      const message = await openai.beta.threads.messages.create(
        thread.id,
        {
          role: "user",
          content: "I need to solve the equation `3x + 11 = 14`. Can you help me?"
        }
      );

      const run = await openai.beta.threads.runs.create(
        thread.id,
        { 
          assistant_id: assistant.id,
          instructions: "Please address the user as Jane Doe. The user has a premium account."
        }
      );

      const messages = await openai.beta.threads.messages.list(
        thread.id
      );

      console.log(messages.data);
      //console.log(messages.data[0].content);
      //console.log(getAnswer(messages.data[0].content));
    }


    async createAssistant (){
      const openai = new OpenAI();
      const myAssistant = await openai.beta.assistants.create({
        instructions:
          "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
        name: "Math Tutor",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-4",
      });
    
      console.log(myAssistant);

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

    async createMessage (threadId: string, content: string) {
      const openai = new OpenAI();
      const myMessage = await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: content,
      });
    
      console.log(myMessage);
    }


    async createRun (threadId: string, assistantId: string, instructions: string) {
      const openai = new OpenAI();
      const myRun = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
        instructions: instructions,
      });
    
      console.log(myRun);
    }

}
