import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDbService {
    private dynamodb: AWS.DynamoDB.DocumentClient;
    private tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME');
  
    constructor(private configService: ConfigService) {
      this.dynamodb = new AWS.DynamoDB.DocumentClient({
        region: 'us-east-1'
      });
    }
  
    async createAssistantRecord(workspaceId: string, assistantId: string, threadId: string, createdBy: string, createdAt: string, instruction: string): Promise<any> {
      const params = {
        TableName: this.tableName,
        Item: {
          PK: `WORKSPACE#${workspaceId}`,
          SK: `ASSISTANT#${assistantId}`,
          assistantId: assistantId,
          threadId: threadId,
          createdBy: createdBy,
          createdAt: createdAt,
          purpose: instruction
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


    async getAssistantRecord (workspaceId: string): Promise<any> {
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
              message: 'Data fetched successfully.',
              datasets: data.Items?.map(item => ({
                
                id: item.id,
                name: item.name,
                description: item.description,
                assistantId: item.assistantId,
                threadId: item.threadId,
                createdAt: item.createdAt,
                createdBy: item.createdBy
              }))
            };
            return response;
          }
            
           catch (error) {
            console.error('Error getting datasets:', error);
            throw new Error(`Unable to get datasets: ${error.message}`);
          }   
}
}