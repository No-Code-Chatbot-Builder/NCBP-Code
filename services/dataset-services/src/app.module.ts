import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PineconeService } from './pinecone/pinecone.service';
import { LangchainDocLoaderService } from './langchain-docLoaders/langchain-docLoaders.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { DynamoDbService } from './dynamo-db/dynamo-db.service';
import { S3Service } from './s3/s3.service';
import { GenerateIdService } from './generate-id/generate-id.service';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [AppController],
  providers: [AppService, PineconeService, LangchainDocLoaderService, DynamoDbService, S3Service, GenerateIdService]
})
export class AppModule implements NestModule {
 configure(consumer: MiddlewareConsumer) {
   consumer.apply(AuthMiddleware).exclude({ path: 'datasets/health', method: RequestMethod.ALL },
   ).forRoutes('*'); // or specify more specific routes or controllers
 }
 }
