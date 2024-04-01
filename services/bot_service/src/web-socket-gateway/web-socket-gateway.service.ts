import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OpenAI } from 'openai';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  async demo(question: string) {
    console.log("hello");
    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: question }],
        model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0]);
    return completion.choices[0];
  }

  // @SubscribeMessage('askGPT')
  // async handleGptRequest(@MessageBody() data: { question: string }) {
  //   console.log("hello from emit")
  //   const response = await this.demo(data.question);
  //   this.server.emit('gptResponse', response);
  // }

  @SubscribeMessage('askGPT')
  async handleGptRequest(@MessageBody() rawData: any) {
    try {
      const data = JSON.parse(rawData);
      console.log("Received data:", data);
      const question = data.question;
      if (!question) {
        console.error('Question is undefined!');
        return;
      }
      const response = await this.demo(question);
      this.server.emit('gptResponse', response);
    } catch (error) {
      console.error('Error parsing data:', error);
    }
  }
  

}
