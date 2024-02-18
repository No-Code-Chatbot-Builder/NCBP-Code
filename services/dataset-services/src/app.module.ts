import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PineconeService } from './pinecone/pinecone.service';
import { LangchainService } from './langchain/langchain.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { DynamoDbService } from './dynamo-db/dynamo-db.service';
import { S3Service } from './s3/s3.service';
import { GenerateIdService } from './generate-id/generate-id.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [AppController],
  providers: [AppService, PineconeService, LangchainService, DynamoDbService, S3Service, GenerateIdService],
})
export class AppModule {}
