import { Body, Controller, Get, Param, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { PineconeService } from './pinecone/pinecone.service';
import { DynamoDbService } from './dynamo-db/dynamo-db.service';
import { S3Service } from './s3/s3.service';
import { CreateIndexRequestMetricEnum } from '@pinecone-database/pinecone';
import { basename } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private pineconeService: PineconeService, private dynamoDbService: DynamoDbService, private s3Service: S3Service) {
 
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("index") 
  async createIndex(@Body() body: {indexName: string, dimension: number, metric: CreateIndexRequestMetricEnum, tableName: string, workspaceId: string}): Promise<any> {
    const { indexName, dimension, metric, tableName, workspaceId } = body;
    const response = await this.pineconeService.createIndex(indexName, dimension, metric);
    
    return response;
  }

  @Post("dataset/:workspaceId")
  async createDataset(@Body() body: {name: string, description?: string}, @Param('workspaceId') workspaceId: string): Promise<any>
  {
    const {name, description } = body;
    
    const userId = "USER#123"; // Replace with req[user] after creating middleware
    const response = await this.dynamoDbService.createDataset( workspaceId, userId, name, description)
    return response
  }

  @Post("data/:workspaceId/:datasetId")@UseInterceptors(FileInterceptor('file'))
  async addData(@UploadedFile() file: Express.Multer.File, @Body() body: {url: string}, @Param('workspaceId') workspaceId: string, @Param('datasetId') datasetId: string): Promise<any> {
    const { url } = body

    

    let data:any;

    if (file)
    {
      data = file;
    }
    else if (url)
    {
      data = url;
    }
    const userId = "USER#123"; // Replace with req[user] after creating middleware

    const response = await this.dynamoDbService.addData(data, userId, workspaceId, datasetId)
    return response;

  }


  @Get("s3")
  async getS3(): Promise<any>
  {
    const bucketName = "ncbp-bucket";
    const filePath = "bitcoin.pdf";
    const userId = "userId"
    const workspaceId = "workspaceId";
    const response = await this.s3Service.getFileFromS3(bucketName, filePath, userId, workspaceId);
    return response;
  }
  
  @Post("embedVectors")
  async embedVectors(): Promise<any> {
    const indexName = "test-index";

    await this.pineconeService.upsertRecords(indexName);
  }
}
