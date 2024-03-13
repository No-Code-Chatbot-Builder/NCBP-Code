import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
//import { GenerateIdService } from 'src/generate-id/generate-id.service';
import { ConfigService } from '@nestjs/config';
//import { S3Service } from 'src/s3/s3.service';
//import { LangchainDocLoaderService } from 'src/langchain-docLoaders/langchain-docLoaders.service';
import { BotService } from 'src/bot/bot.service';

@Injectable()
export class DynamoDbService {
    private dynamodb: AWS.DynamoDB.DocumentClient;
    private tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME');
    private botServie: BotService;
  
    constructor(
      private configService: ConfigService,
      //private LangchainDocLoaderService: LangchainDocLoaderService,
      //private readonly s3Service: S3Service
    ) {
      // Inject S3Service) {
      // Initialize the DynamoDB DocumentClient
      this.dynamodb = new AWS.DynamoDB.DocumentClient({
        region: 'us-east-1'
      });
    }
  
    async addData(workspaceId: string, assistantId: string, threadId: string, createdBy: string, createdAt: string): Promise<any> {
      const params = {
        TableName: this.tableName,
        Item: {
          PK: `WORKSPACE#${workspaceId}`,
          SK: `ASSISTANT#${assistantId}`,
          assistantId: assistantId,
          threadId: threadId,
          createdBy: createdBy,
          createdAt: createdAt
        }
      };
    
      try {
        const data = await this.dynamodb.put(params).promise();
    
        const response = {
          success: true,
          message: 'Thread created successfully.',
          workspaceId: workspaceId,
          threadDetails: {
            assistantId: assistantId,
            threadId: threadId,
            createdBy: createdBy,
            createdAt: createdAt
          }
        };
    
        return response;
      } catch (error) {
        throw new Error(`Unable to create thread: ${error.message}`);
      }
    }


    async sendWorkspaceId (workspaceId: string, query: string): Promise<any> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: 'PK = :pk',
            ExpressionAttributeValues: {
              ':pk': `WORKSPACE#${workspaceId}`
            }
          };
      
          try {
            const data = await this.dynamodb.query(params).promise();
      
            const response = {
              success: true,
              message: 'Datasets fetched successfully.',
              datasets: data.Items?.map(item => ({
                
                id: item.id,
                name: item.name,
                description: item.description,
                assistantId: item.assistantId,
                threadId: item.threadId,
                createdAt: item.createdAt,
                createdBy: item.createdBy,
                
                
              }))
            };
            console.log(response)
            //idher araha hai vo msg pe nahi ja raha
            //response sahi print kar raha hai
            this.botServie.createMessage(data.Items[0].threadId, data.Items[0].assistantId, query);
            return response;
          }
            
           catch (error) {
            console.error('Error getting datasets:', error);
            throw new Error(`Unable to get datasets: ${error.message}`);
          }
    
}
}