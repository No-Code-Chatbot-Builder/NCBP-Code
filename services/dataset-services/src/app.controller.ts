import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PineconeService } from './pinecone/pinecone.service';
import { DynamoDbService } from './dynamo-db/dynamo-db.service';
import { S3Service } from './s3/s3.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private pineconeService: PineconeService, private dynamoDbService: DynamoDbService, private s3Service: S3Service) {
 
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post("create")
  async createIndex(): Promise<any> {
    const indexName = "test-index-2";
    const dimension = 2;
    const metric = "euclidean";
    const response = await this.pineconeService.createIndex(indexName, dimension, metric);
    return response;
  }

  @Post("s3")
  async postS3(): Promise<any>
  {
    const bucketName = "ncbp-bucket";
    const filePath = "bitcoin.pdf";
    const userId = "userId"
    const workspaceId = "workspaceId";
    const response = await this.s3Service.uploadFileToS3(bucketName, filePath, userId, workspaceId);
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
  @Post("dataset")
  async dataset(): Promise<any> {
    const datasetRecord = {
      id: "datasetId",
      name: "Dataset Name",
      description: "Dataset Description",
      workspaceId: "workspaceId",
      data: [
        {
          id: "dataId1",
          type: "file",
          path: "https://s3:pathfile",
        },
        {
          id: "dataId2",
          type: "text",
          content: "Hello world This is NCBP",
        },
        {
          id: "dataId3",
          type: "website",
          url: "https://www.google.com",
        },
        // ... other data items
      ],
    };
    
    await this.dynamoDbService.addDatasetRecord('ncbp', datasetRecord);
  }
}
