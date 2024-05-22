import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDbService {
  private dynamodb: AWS.DynamoDB.DocumentClient;
  private tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME');

  constructor(private configService: ConfigService) {
    this.dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
  }

  async createAssistantRecord(
    workspaceId: string,
    assistantId: string,
    threadId: string,
    createdBy: string,
    createdAt: string,
    instruction: string,
    dataSetId: string,
    assistantName: string,
  ): Promise<any> {
    const params = {
      TableName: this.tableName,
      Item: {
        PK: `WORKSPACE#${workspaceId}`,
        SK: `ASSISTANT#${assistantId}`,
        assistantId: assistantId,
        threadId: threadId,
        createdBy: createdBy,
        createdAt: createdAt,
        purpose: instruction,
        dataSetId: dataSetId,
        assistantName: assistantName,
      },
    };

    try {
      const data = await this.dynamodb.put(params).promise();

      const response = {
        success: true,
        message: 'Data added successfully.',
        workspaceId: workspaceId,
        threadDetails: {
          assistantId: assistantId,
          threadId: threadId,
          createdBy: createdBy,
          createdAt: createdAt,
          dataSetId: dataSetId,
        },
      };
      return response;
    } catch (error) {
      throw new Error(`Unable to create thread: ${error.message}`);
    }
  }

  async getAllAssistant(workspaceId: string): Promise<any> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': `WORKSPACE#${workspaceId}`,
        ':skPrefix': 'ASSISTANT#',
      },
      FilterExpression: 'attribute_not_exists(deletedAt)',
    };

    try {
      const data = await this.dynamodb.query(params).promise();
      const response = {
        success: true,
        message: 'Assistants fetched successfully.',
        assistants: data.Items?.map((item) => ({
          id: item.id,
          assistantId: item.assistantId,
          purpose: item.purpose,
          assistantName: item.assistantName,
        })),
      };
      return response;
    } catch (error) {
      console.error('Error getting assistants:', error);
      throw new Error(`Unable to get assistants: ${error.message}`);
    }
  }

  async getAssistantRecord2(
    workspaceId: string,
    assistantId: string,
  ): Promise<any> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk AND SK = :sk',
      ExpressionAttributeValues: {
        ':pk': `WORKSPACE#${workspaceId}`,
        ':sk': `ASSISTANT#${assistantId}`,
      },
    };

    try {
      const data = await this.dynamodb.query(params).promise();

      const response = {
        success: true,
        message: 'Data fetched successfully.',
        data: data.Items?.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          assistantId: item.assistantId,
          threadId: item.threadId,
          createdAt: item.createdAt,
          createdBy: item.createdBy,
          dataSetId: item.dataSetId,
          deletedAt: item.deletedAt,
        })),
      };
      return response;
    } catch (error) {
      console.error('Error getting data:', error);
      throw new Error(`Unable to get data: ${error.message}`);
    }
  }

  async deletion(workspaceId: string, assistantId: string): Promise<any> {
    {
      // Proceed to mark the data as deleted if it's not already marked.
      const updateParams = {
        TableName: this.tableName,
        Key: {
          PK: `WORKSPACE#${workspaceId}`,
          SK: `ASSISTANT#${assistantId}`,
        },
        UpdateExpression: 'set #deletedAt = :deletedAt',
        ExpressionAttributeNames: {
          '#deletedAt': 'deletedAt',
        },
        ExpressionAttributeValues: {
          ':deletedAt': new Date().toISOString(),
        },
        ReturnValues: 'UPDATED_NEW',
      };

      try {
        const updateResult = await this.dynamodb.update(updateParams).promise();
        return {
          success: true,
          message: 'Bot marked as deleted successfully.',
          deletedAt: updateResult.Attributes,
        };
      } catch (error) {
        console.error('Error marking bot as deleted:', error);
      }
    }
  }
}

// async getAssistantRecord (workspaceId: string): Promise<any> {
//     const params = {
//         TableName: this.tableName,
//         KeyConditionExpression: 'PK = :pk',
//         ExpressionAttributeValues: {
//           ':pk': `WORKSPACE#${workspaceId}`
//         }
//       };

//       try {
//         const data = await this.dynamodb.query(params).promise();

//         const response = {
//           success: true,
//           message: 'Data fetched successfully.',
//           datasets: data.Items?.map(item => ({

//             id: item.id,
//             name: item.name,
//             description: item.description,
//             assistantId: item.assistantId,
//             threadId: item.threadId,
//             createdAt: item.createdAt,
//             createdBy: item.createdBy,
//             dataSetId: item.dataSetId
//           }))
//         };
//         return response;
//       }

//        catch (error) {
//         console.error('Error getting datasets:', error);
//         throw new Error(`Unable to get datasets: ${error.message}`);
//       }
//     }
