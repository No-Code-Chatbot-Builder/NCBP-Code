import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { GenerateIdService } from 'src/generate-id/generate-id.service';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/s3/s3.service';
import { LangchainDocLoaderService } from 'src/langchain-docLoaders/langchain-docLoaders.service';

@Injectable()
export class DynamoDbService {
  private dynamodb: AWS.DynamoDB.DocumentClient;
  private tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME');

  constructor(
    private configService: ConfigService,
    private LangchainDocLoaderService: LangchainDocLoaderService,
    private readonly s3Service: S3Service
  ) {
    // Inject S3Service) {
    // Initialize the DynamoDB DocumentClient
    this.dynamodb = new AWS.DynamoDB.DocumentClient({
      region: 'us-east-1'
    });
  }

  async createDataset(workspaceId: string, userId: string, name: string, description: string): Promise<any> {
    const datasetId = GenerateIdService.generateId();
    const datasetDetails = {
      PK: `WORKSPACE#${workspaceId}`,
      SK: `DATASET#${datasetId}`,
      id: datasetId,
      createdBy: userId,
      name: name,
      description: description,
      createdAt: new Date().toISOString()
    };
    const params = {
      TableName: this.tableName,

      Item: datasetDetails
    };

    try {
      const data = await this.dynamodb.put(params).promise();

      const response = {
        success: true,
        message: 'Dataset created successfully.',
        datasetDetails: {
          datasetId: datasetId,
          name: name,
          description: description
        }
      };

      return response; // Return the response object
    } catch (error) {
      throw new Error(`Unable to create dataset: ${error.message}`);
    }
  }

  async addData(data: any, userId: string, workspaceId: string, datasetId: string): Promise<any> {
    let type: string;
    let path: string;
    let name: string;

    let responseForAddingFileNameUUID: {
      success: boolean;
      message: string;
      fileId: string;
    };

    let response: {
      responseForAddingData: {
        success: boolean;
        message: string;
        dataDetails: {
          dataId: string;
          type: string;
          path: string;
        };
      };
      responseForAddingFileNameUUID?: typeof responseForAddingFileNameUUID;
    };

    if (typeof data === 'string') {
      type = 'url';
      path = data;
      const parsedUrl = new URL(data);
      name = parsedUrl.hostname;
    } else if (typeof data === 'object') {
      let fileHandlerResponse: {
        type: string;
        name: string;
        path: string;
        responseForAddingFileNameUUID: typeof responseForAddingFileNameUUID;
      };
      try {
        fileHandlerResponse = await this.fileHandler(data, userId, workspaceId, datasetId);
      } catch (error) {
        console.error('Error handling file:', error);
        throw new Error(`Unable to handle file: ${error.message}`);
      }
      type = fileHandlerResponse.type;
      name = fileHandlerResponse.name;
      path = fileHandlerResponse.path;
      responseForAddingFileNameUUID = fileHandlerResponse.responseForAddingFileNameUUID;
    }

    const dataId = GenerateIdService.generateId();
    const dataItem = {
      PK: `DATASET#${datasetId}`, // Sort key can be the same as the PK if there's only one entry per dataset
      SK: `DATA#${dataId}`, // Use a partition key format that aligns with your access patterns
      id: dataId,
      name: name,
      type: type,
      path: path,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    const params = {
      TableName: this.tableName,
      Item: dataItem
    };

    try {
      const dynamoDbResponse = await this.dynamodb.put(params).promise();

      response = {
        responseForAddingData: {
          success: true,
          message: 'Data added successfully.',
          dataDetails: {
            dataId: dataId,
            type: type,
            path: path
          }
        }
      };

      if (responseForAddingFileNameUUID) {
        response.responseForAddingFileNameUUID = responseForAddingFileNameUUID;
      }

      try {
        this.LangchainDocLoaderService.dataProcessor(data, userId, workspaceId, datasetId);
      } catch (error) {
        console.error('Error from Langchain Loaders:', error);
        throw new Error(`Error from Langchain Loaders:: ${error.message}`);
      }

      return response;
    } catch (error) {
      console.error('Error creating dataset record:', error);
      throw new Error(`Unable to create dataset record: ${error.message}`);
    }
  }

  async fileHandler(file: Express.Multer.File, userId: string, workspaceId: string, datasetId: string) {
    const bucketName = this.configService.get<string>('S3_BUCKET_NAME');
    const type = 'file';
    const fileId = GenerateIdService.generateId();
    const path = 'https://' + bucketName + '.s3.us-east-1.amazonaws.com/' + `USER#${userId}/` + `WORKSPACE#${workspaceId}/` + `DATASET#${datasetId}/` + fileId;
    const name = file.originalname;

    const dataItem = {
      PK: `DATANAME#${name}`, // Sort key can be the same as the PK if there's only one entry per dataset
      SK: `FILE#${fileId}`, // Use a partition key format that aligns with your access patterns
      id: fileId,
      createdAt: new Date().toISOString()
    };

    const params = {
      TableName: this.tableName,
      Item: dataItem
    };

    let responseForAddingFileNameUUID: {
      success: boolean;
      message: string;
      fileId: string;
    };
    try {
      const dynamoDbResponseForAddingFileNameUUID = await this.dynamodb.put(params).promise();

      responseForAddingFileNameUUID = {
        success: true,
        message: 'File Name against UUID added successfully to DynamoDb.',
        fileId: fileId
      };
      //return response;
    } catch (error) {
      console.error('Error adding File Name against UUID in DynamoDb:', error);
      throw new Error(`Unable to add File Name against UUID in DynamoDb: ${error.message}`);
    }

    // Upload the file to S3
    try {
      this.s3Service.uploadFileToS3(bucketName, file, fileId, userId, workspaceId, datasetId);
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error(`Unable to upload file to S3: ${error.message}`);
    }

    return { type, name, path, responseForAddingFileNameUUID };
  }
  async getDatasets(workspaceId: string) {
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
          createdAt: item.createdAt,
          createdBy: item.createdBy
        }))
      };
      return response;
    } catch (error) {
      console.error('Error getting datasets:', error);
      throw new Error(`Unable to get datasets: ${error.message}`);
    }
  }

  async getDatasetById(workspaceId: string, datasetId: string): Promise<any> {
    // Query parameters to fetch the dataset by workspaceId and datasetId
    const paramsForDataset = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk and SK = :sk',
      ExpressionAttributeValues: {
        ':pk': `WORKSPACE#${workspaceId}`,
        ':sk': `DATASET#${datasetId}`
      }
    };

    try {
      const datasetResult = await this.dynamodb.query(paramsForDataset).promise();
      let response;
      // Assuming there's only one dataset with this specific datasetId
      if (datasetResult.Items.length > 0) {
        response = {
          success: true,
          message: 'Dataset fetched successfully.',
          datasetDetails: {
            datasetId: datasetResult.Items[0].id,
            name: datasetResult.Items[0].name,
            description: datasetResult.Items[0].description,
            createdAt: datasetResult.Items[0].createdAt,
            createdBy: datasetResult.Items[0].createdBy
          }
        };

        // Query parameters to fetch related data using the datasetId
        const paramsForData = {
          TableName: this.tableName,
          KeyConditionExpression: 'PK = :pk',
          ExpressionAttributeValues: {
            ':pk': `DATASET#${datasetId}`
          }
        };

        try {
          const dataResult = await this.dynamodb.query(paramsForData).promise();

          // Assuming you want to nest the related data within the dataset item
          response.data = dataResult.Items?.map(item => ({
            dataId: item.id,
            name: item.name,
            type: item.type,
            path: item.path,
            createdAt: item.createdAt,
            createdBy: item.createdBy
          }));

          return response; // Return the combined dataset with its related data
        } catch (error) {
          console.error('Error getting related data:', error);
          throw new Error(`Unable to get related data: ${error.message}`);
        }
      } else {
        return null; // No dataset found with the given IDs
      }
    } catch (error) {
      console.error('Error getting dataset:', error);
      throw new Error(`Unable to get dataset: ${error.message}`);
    }
  }

  async getDataById(datsetId: string, dataId: string): Promise<any> {
    const params = {
      TableName: this.tableName,
      Key: {
        PK: `DATASET#${datsetId}`,
        SK: `DATA#${dataId}`
      }
    };

    try {
      const data = await this.dynamodb.get(params).promise();
      const response = {
        success: true,
        message: 'Data fetched successfully.',
        dataDetails: {
          dataId: data.Item.id,
          type: data.Item.type,
          path: data.Item.path
        }
      };

      return response;
    } catch (error) {
      console.error('Error getting data:', error);
      throw new Error(`Unable to get data: ${error.message}`);
    }
  }
}
