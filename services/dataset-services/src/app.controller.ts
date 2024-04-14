import { Body, Controller, Get, Param, Post, UseInterceptors, UploadedFile, BadRequestException, Req, Put, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { PineconeService } from './pinecone/pinecone.service';
import { DynamoDbService } from './dynamo-db/dynamo-db.service';
import { CreateIndexRequestMetricEnum } from '@pinecone-database/pinecone';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private pineconeService: PineconeService,
    private dynamoDbService: DynamoDbService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('datasets/health')
  async healthCheck(): Promise<any> {
    return { statuscode: 200,
      message: 'ok' };
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

  @Post('datasets/:workspaceId')
  async createDataset(@Req() req: Request, @Body() body: { name: string; description?: string }, @Param('workspaceId') workspaceId: string): Promise<any> {
    const { name, description } = body;

    const userId = req['user'].id; // Replace with req[user] after creating middleware
    const response = await this.dynamoDbService.createDataset(workspaceId, userId, name, description);
    return response;
  }

  @Get('datasets/:workspaceId/')
  async getDatasets(@Param('workspaceId') workspaceId: string): Promise<any> {
    const response = await this.dynamoDbService.getDatasets(workspaceId);
    return response;
  }

  @Get('datasets/:workspaceId/:datasetId')
  async getDatasetById(@Param('workspaceId') workspaceId: string, @Param('datasetId') datasetId: string): Promise<any> {
    const dataset = await this.dynamoDbService.getDatasetById(workspaceId, datasetId);
    return dataset;
  }

  @Post('datasets/:workspaceId/:datasetId/data/')
  @UseInterceptors(FileInterceptor('file'))
  async addData(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { url: string },
    @Param('workspaceId') workspaceId: string,
    @Param('datasetId') datasetId: string
  ): Promise<any> {
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
    const userId = req['user'].id; // Replace with req[user] after creating middleware

    const response = await this.dynamoDbService.addData(data, userId, workspaceId, datasetId);
    return response;
  }

  @Get('datasets/:workspaceId/:datasetId/data/:dataId')
  async getDataById(@Param('datasetId') datasetId: string, @Param('dataId') dataId: string): Promise<any> {
    const response = await this.dynamoDbService.getDataById(datasetId, dataId);

    return response;
  }

  @Put('datasets/:workspaceId/:datasetId')
  async updateDatasetById(@Body() body: { name: string; description?: string }, @Param('workspaceId') workspaceId: string, @Param('datasetId') datasetId: string): Promise<any> {
    const { name, description } = body;
    const response = await this.dynamoDbService.updateDatasetById(workspaceId, datasetId, {name, description});
    return response;
  }

  @Delete('datasets/:workspaceId/:datasetId')
  async softDeleteDatasetById(@Param('workspaceId') workspaceId: string, @Param('datasetId') datasetId: string): Promise<any> {  
    const response = await this.dynamoDbService.softDeleteDatasetById(workspaceId, datasetId);
    return response;
  }

  @Delete('datasets/:workspaceId')
  async softDeleteDatasets(@Param('workspaceId') workspaceId: string): Promise<any> {
    const response = await this.dynamoDbService.softDeleteDatasets(workspaceId);
    return response;
  }

  @Delete('datasets/:workspaceId/:datasetId/data/:dataId')
  async softDeleteDataItemsById(@Param('datasetId') datasetId: string, @Param('dataId') dataId: string): Promise<any> {
    const response = await this.dynamoDbService.softDeleteDataItemsById(datasetId, dataId);
    return response;
  }

}
