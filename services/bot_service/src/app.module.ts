import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Gpt3Service } from './botDemo/botDemo.service';
import { BotService } from './bot/bot.service';
import { DynamoDbService } from './dynamo-db/dynamo-db.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, Gpt3Service, BotService, DynamoDbService],
})
export class AppModule {}
