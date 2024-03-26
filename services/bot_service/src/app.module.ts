import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotService } from './bot/bot.service';
import { DynamoDbService } from './dynamo-db/dynamo-db.service';
import { ConfigModule } from '@nestjs/config'; 
import { AuthMiddleware} from './auth/auth.middleware';
import { HttpModule } from '@nestjs/axios';
//import { WebsocketService } from './websocket/websocket.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [AppController],
  providers: [AppService, BotService, DynamoDbService, /*WebsocketService*/], 
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude({ path: 'bot/health', method: RequestMethod.ALL },
    ).forRoutes('*'); // or specify more specific routes or controllers
  }
  }