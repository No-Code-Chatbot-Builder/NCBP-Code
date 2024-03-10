import { Body, Controller, Get, Param, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { PineconeService } from './pinecone/pinecone.service';
import { DynamoDbService } from './dynamo-db/dynamo-db.service';
import { S3Service } from './s3/s3.service';
import { CreateIndexRequestMetricEnum } from '@pinecone-database/pinecone';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private pineconeService: PineconeService,
    private dynamoDbService: DynamoDbService,
    private s3Service: S3Service
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('index')
  async createIndex(
    @Body()
    body: {
      indexName: string;
      dimension: number;
      metric: CreateIndexRequestMetricEnum;
      tableName: string;
      workspaceId: string;
    }
  ): Promise<any> {
    const { indexName, dimension, metric, tableName, workspaceId } = body;
    const response = await this.pineconeService.createIndex(indexName, dimension, metric);

    return response;
  }

  @Post(':workspaceId/dataset')
  async createDataset(@Body() body: { name: string; description?: string }, @Param('workspaceId') workspaceId: string): Promise<any> {
    const { name, description } = body;

    const userId = 'USER#123'; // Replace with req[user] after creating middleware
    const response = await this.dynamoDbService.createDataset(workspaceId, userId, name, description);
    return response;
  }

  @Get(':workspaceId/dataset/')
  async getDatasets(@Param('workspaceId') workspaceId: string): Promise<any> {
    const response = await this.dynamoDbService.getDatasets(workspaceId);
    return response;
  }

  @Get(':workspaceId/dataset/:datasetId')
  async getDatasetById(@Param('workspaceId') workspaceId: string, @Param('datasetId') datasetId: string): Promise<any> {
    const dataset = await this.dynamoDbService.getDatasetById(workspaceId, datasetId);
    return dataset;
  }

  @Post(':workspaceId/:datasetId/data/')
  @UseInterceptors(FileInterceptor('file'))
  async addData(@UploadedFile() file: Express.Multer.File, @Body() body: { url: string }, @Param('workspaceId') workspaceId: string, @Param('datasetId') datasetId: string): Promise<any> {
    let data: Express.Multer.File | string;

    if (file && body.url) {
      throw new BadRequestException('Please provide either a file or a URL, not both.');
    } else if (file) {
      // Add additional file validations as needed
      data = file;
    } else if (body.url) {
      // URL validation should occur in your DTO, additional checks can be performed here
      data = body.url;
    } else {
      throw new BadRequestException('No data provided. Please upload a file or provide a URL.');
    }
    const userId = '123'; // Replace with req[user] after creating middleware

    const response = await this.dynamoDbService.addData(data, userId, workspaceId, datasetId);
    return response;
  }

  @Get(':workspaceId/:datasetId/data/:dataId')
  async getDataById(@Param('datasetId') datasetId: string, @Param('dataId') dataId: string): Promise<any> {
    const response = await this.dynamoDbService.getDataById(datasetId, dataId);
    return response;
  }
}
