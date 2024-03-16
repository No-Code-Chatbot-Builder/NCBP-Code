import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotService } from './bot/bot.service';
import { DynamoDbService } from './dynamo-db/dynamo-db.service';
import { ConfigModule } from '@nestjs/config'; 
import { AuthMiddleware} from './auth/auth.middleware';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, BotService, DynamoDbService], 
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*'); // or specify more specific routes or controllers
  }
}