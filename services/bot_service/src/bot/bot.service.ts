import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BotService {}

export class Gpt3Service {
    async generateResponse(query: string): Promise<string> {
      const apiKey = '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';
      const endpoint = 'https://api.openai.com/v1/completions';
  
      const response = await axios.post(
        endpoint,
        {
          model: 'gpt-3.5-turbo-instruct, babbage-002, davinci-002', // Or any other GPT-3.5 model you prefer
          prompt: query,
          max_tokens: 100,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        },
      );
  
      return response.data.choices[0].text.trim();
    }
  }