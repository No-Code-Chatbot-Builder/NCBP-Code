import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Gpt3Service } from './bot/bot.service';
import { BotServiceService } from './bot_service/bot_service.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, Gpt3Service, BotServiceService],
})
export class AppModule {}
