import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { GenerateIdService } from 'src/generate-id/generate-id.service';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/s3/s3.service';
import { LangchainDocLoaderService } from 'src/langchain-docLoaders/langchain-docLoaders.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class DynamoDbService {
    private dynamodb: AWS.DynamoDB.DocumentClient;
    private tableName =  this.configService.get<string>('DYNAMODB_TABLE_NAME');

    constructor(private configService: ConfigService, private LangchainDocLoaderService: LangchainDocLoaderService) {
        // Initialize the DynamoDB DocumentClient
        this.dynamodb = new AWS.DynamoDB.DocumentClient({
            region: 'us-east-1' 
        });
    }

    async createDataset(workspaceId: string, userId: string, name: string, description: string): Promise<any>
    {
        const datasetId = `DATASET#${GenerateIdService.generateId()}`;
        const datasetDetails = {
          PK: datasetId, 
          SK: `WORKSPACEID#${workspaceId}`,
          userId: userId,
          name: name,
          description: description
        }
        const params = {
            TableName: this.tableName,
           
            Item: datasetDetails,
          };
      
          try {
            const data = await this.dynamodb.put(params).promise();

            const response = {
              success: true,
              message: "Dataset created successfully.",
              workspaceId: workspaceId,
              datasetDetails: {
                  datasetId: datasetId,
                  name: name,
                  description: description,
                  workspaceId: workspaceId,
                  
              },

              

          };

          return response; // Return the response object
            
          } catch (error) {
            
            throw new Error(`Unable to create dataset: ${error.message}`);
          }

    }

    async addData(data: any, userId: string, workspaceId: string, datasetId: string): Promise<any> {

        
        // ...

        let type: string;
        let path: string;
        let name: string;

        if (typeof data === 'string') {
          type = "url";
          path = data;
          const parsedUrl = new URL(data);
          name = parsedUrl.hostname;
        }
        else if (typeof data === 'object') {
          const bucketName = this.configService.get<string>('S3_BUCKET_NAME')
          type = "file";
          path = "https://" + bucketName + ".s3.us-east-1.amazonaws.com/" + userId + "/" + workspaceId + "/" + datasetId;
          name = data.originalname;

          // Upload the file to S3
          const s3Service = new S3Service();
          s3Service.uploadFileToS3(bucketName, data, `USER#${userId}`, `WORKSPACE#${workspaceId}`, `DATASET#${datasetId}`);


        }

        const dataId = `DATA#${GenerateIdService.generateId()}`;
        const dataItem = {
          PK: dataId, // Use a partition key format that aligns with your access patterns
          SK: `DATASET#${datasetId}`, // Sort key can be the same as the PK if there's only one entry per dataset
          name: name,
          type: type,
          path: path,
          userId: `USER#${userId}`,
        };
        
        const params = {
            TableName: this.tableName,
            Item: dataItem,
          };
      
          try {
            const dynamoDbResponse = await this.dynamodb.put(params).promise();
            
            const response = {
              success: true,
              message: "Data added successfully.",
              datasetId: datasetId,
              dataDetails: {
                  dataId: dataId,
                  type: type,
                  path: path
                  
              },
              

            };
            
            const httpService = new HttpService();
            this.LangchainDocLoaderService.dataProcessor(data, userId, workspaceId, datasetId);
            


            return response; 
          } catch (error) {
            console.error('Error creating dataset record:', error);
            throw new Error(`Unable to create dataset record: ${error.message}`);
          }
    }

}
