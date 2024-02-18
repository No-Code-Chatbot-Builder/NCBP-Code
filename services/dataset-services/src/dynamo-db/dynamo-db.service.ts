import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { GenerateIdService } from 'src/generate-id/generate-id.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDbService {
    private dynamodb: AWS.DynamoDB.DocumentClient;

    constructor(private configService: ConfigService) {
        // Initialize the DynamoDB DocumentClient
        this.dynamodb = new AWS.DynamoDB.DocumentClient({
            region: 'us-east-1' 
        });
    }

    async createDataset(workspaceId: string, userId: string, name: string, description: string): Promise<void>
    {
        const datasetDetails = {
          PK: `DATASET#${GenerateIdService.generateId()}`, 
          SK: `WORKSPACEID#${workspaceId}`,
          userId: userId,
          name: name,
          description: description
        }
        const params = {
            TableName: this.configService.get<string>('DYANMODB_TABLE_NAME'),
            Item: datasetDetails,
          };
      
          try {
            const data = await this.dynamodb.put(params).promise();
            
          } catch (error) {
            
            throw new Error(`Unable to create dataset: ${error.message}`);
          }

    }
    async addDatasetRecord(tableName: string, dataset: any): Promise<PutItemOutput> {
        const datasetItem = {
          PK: `DATASET#${GenerateIdService.generateId()}`, // Use a partition key format that aligns with your access patterns
          SK: `METADATA#${dataset.id}`, // Sort key can be the same as the PK if there's only one entry per dataset
          Name: dataset.name,
          Description: dataset.description,
          WorkspaceId: dataset.workspaceId,
          Data: dataset.data, // Assuming 'data' is an array of objects as in your provided JSON structure
          // ... include other dataset attributes as necessary
        };
        
        const params = {
            TableName: tableName,
            Item: datasetItem,
          };
      
          try {
            const data = await this.dynamodb.put(params).promise();
            console.log('Dataset record created successfully:', data);
            return data; // The response from DynamoDB
          } catch (error) {
            console.error('Error creating dataset record:', error);
            throw new Error(`Unable to create dataset record: ${error.message}`);
          }
    }

}
