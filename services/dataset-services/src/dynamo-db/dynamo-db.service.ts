import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { GenerateIdService } from 'src/generate-id/generate-id.service';
import { ConfigService } from '@nestjs/config';
import { S3Service } from 'src/s3/s3.service';
import { LangchainDocLoaderService } from 'src/langchain-docLoaders/langchain-docLoaders.service';
import { PineconeService } from 'src/pinecone/pinecone.service';
import { Pinecone } from '@pinecone-database/pinecone';

@Injectable()
export class DynamoDbService {
  private dynamodb: AWS.DynamoDB.DocumentClient;
  private tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME');
  

  constructor(
    private configService: ConfigService,
    private LangchainDocLoaderService: LangchainDocLoaderService,
    private readonly s3Service: S3Service,
    private pineconeService: PineconeService
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
      jsonlId: "",
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
          description: description,
          createdAt: datasetDetails.createdAt,
          createdBy: userId
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
            path: path,
          }
        }
      };

      if (responseForAddingFileNameUUID) {
        response.responseForAddingFileNameUUID = responseForAddingFileNameUUID;
      }

      try {
        this.LangchainDocLoaderService.dataProcessor(data, userId, workspaceId, datasetId, dataId);
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
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': `WORKSPACE#${workspaceId}`,
        ':skPrefix': 'DATASET#'
      },
      FilterExpression: 'attribute_not_exists(deletedAt)'
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
      },
      FilterExpression: 'attribute_not_exists(deletedAt)'
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
          },
          FilterExpression: 'attribute_not_exists(deletedAt)'
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

  async updateDatasetById(workspaceId: string, datasetId: string, updateData: { name?: string; description?: string }): Promise<any> {
    const updateExpression: string[] = [];
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    try {

      if (Object.keys(updateData).length === 0) {
        throw new Error('No update data provided');
      }
    
      // Constructing the update expression based on which attributes are present in updateData
      if (updateData.name) {
        updateExpression.push('#name = :name');
        expressionAttributeNames['#name'] = 'name';
        expressionAttributeValues[':name'] = updateData.name;
      }
    
      if (updateData.description) {
        updateExpression.push('#description = :description');
        expressionAttributeNames['#description'] = 'description';
        expressionAttributeValues[':description'] = updateData.description;
      }
    
  
      updateExpression.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();
  
      const params = {
        TableName: this.tableName,
        Key: {
          PK: `WORKSPACE#${workspaceId}`,
          SK: `DATASET#${datasetId}`
        },
        UpdateExpression: 'SET ' + updateExpression.join(', '),
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'UPDATED_NEW'
      };
    
      try {
        const updateResult = await this.dynamodb.update(params).promise();
        return {
          success: true,
          message: 'Dataset updated successfully.',
          attributes: updateResult.Attributes
        };
      } catch (error) {
        console.error('Error updating dataset:', error);
        throw new Error(`Unable to update dataset: ${error.message}`);
      }

    }
    
    catch (error) {
      console.error('Error updating dataset:', error);
      
    }
  
  }

  async softDeleteDatasetById(workspaceId: string, datasetId: string): Promise<any> {
    // First, retrieve the current dataset to see if it's already marked as deleted.
    const getParams = {
      TableName: this.tableName,
      Key: {
        PK: `WORKSPACE#${workspaceId}`,
        SK: `DATASET#${datasetId}`
      }
    };
  
    let currentData;
    try {
      const getResult = await this.dynamodb.get(getParams).promise();
      currentData = getResult.Item;
    } catch (error) {
      console.error('Error retrieving dataset:', error);
      throw new Error(`Unable to retrieve dataset: ${error.message}`);
    }
  
    // If the dataset is already marked as deleted, we return an appropriate message.
    if (currentData && currentData.deletedAt) {
      return {
        success: false,
        message: 'Dataset is already marked as deleted.',
        deletedAt: currentData.deletedAt
      };
    }
 
    let response;

    try {
        const response = await this.softDeleteDataItems(datasetId);
    }
    catch (error)
    {
      console.error('Error during soft deletion of data items:', error);
      throw new Error(`Unable to soft delete data items: ${error.message}`);
    }
    // Proceed to mark the dataset as deleted if it's not already marked.
    const updateParams = {
      TableName: this.tableName,
      Key: {
        PK: `WORKSPACE#${workspaceId}`,
        SK: `DATASET#${datasetId}`
      },
      UpdateExpression: 'set #deletedAt = :deletedAt',
      ExpressionAttributeNames: {
        '#deletedAt': 'deletedAt'
      },
      ExpressionAttributeValues: {
        ':deletedAt': new Date().toISOString()
      },
      ReturnValues: 'UPDATED_NEW'
    };
  
    try {
      const updateResult = await this.dynamodb.update(updateParams).promise();
      return {
        success: true,
        message: 'Dataset marked as deleted successfully.',
        attributes: updateResult.Attributes
      };
    } catch (error) {
      console.error('Error marking dataset as deleted:', error);
      throw new Error(`Unable to mark dataset as deleted: ${error.message}`);
    }
  }
  
  async softDeleteDatasets(workspaceId: string): Promise<any> {
     // Retrieve all datasets from the workspace
  const queryParams = {
    TableName: this.tableName,
    KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `WORKSPACE#${workspaceId}`,
      ':sk': 'DATASET#'
    }
  };

  let datasets;
  try {
    const queryResult = await this.dynamodb.query(queryParams).promise();
    datasets = queryResult.Items;
  } catch (error) {
    console.error('Error retrieving datasets:', error);
    throw new Error(`Unable to retrieve datasets: ${error.message}`);
  }

  // Array to hold results of deletions
  const deletionResults = [];

  for (const dataset of datasets) {
    const datasetId = dataset.SK.split('#')[1];  // SK format is 'DATASET#datasetId'
    try {
      const deletionResult = await this.softDeleteDatasetById(workspaceId, datasetId);
      deletionResults.push({
        datasetId: datasetId,
        success: deletionResult.success,
        message: deletionResult.message,
        deletedAt: deletionResult.deletedAt || null
      });
    } catch (error) {
      deletionResults.push({
        datasetId: datasetId,
        success: false,
        message: error.message
      });
    }
  }

  return {
    success: true,
    datasets: deletionResults
  };


  //   // First, query all datasets within the workspace that are not already soft-deleted.
  //   const queryParams = {
  //     TableName: this.tableName,
  //     KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
  //     ExpressionAttributeValues: {
  //       ':pk': `WORKSPACE#${workspaceId}`,
  //       ':sk': 'DATASET#'
  //     },
  //     FilterExpression: 'attribute_not_exists(deletedAt)'
  //   };
  
  //   try {
  //     const queryResult = await this.dynamodb.query(queryParams).promise();
  //     const datasets = queryResult.Items;
  
  //     // If no datasets to delete, return early.
  //     if (!datasets || datasets.length === 0) {
  //       return {
  //         success: true,
  //         message: 'No datasets to soft delete.'
  //       };
  //     }
  

  //     // Perform soft delete on each dataset.
  //     const updatePromises = datasets.map((dataset) => {
        
  //       const updateParams = {
  //         TableName: this.tableName,
  //         Key: {
  //           PK: dataset.PK,
  //           SK: dataset.SK
  //         },
  //         UpdateExpression: 'set #deletedAt = :deletedAt',
  //         ExpressionAttributeNames: {
  //           '#deletedAt': 'deletedAt'
  //         },
  //         ExpressionAttributeValues: {
  //           ':deletedAt': new Date().toISOString()
  //         },
  //         ReturnValues: 'ALL_NEW'
  //       };
        
  //       return this.dynamodb.update(updateParams).promise();
  //     });
  
  //     // Wait for all the soft delete operations to complete.
  //     const results = await Promise.allSettled(updatePromises);
      
  //     // Filter out successful updates and prepare the response.
  //     const successfulUpdates = results.filter(result => result.status === 'fulfilled').map((result) => {
  //       const value = (result as PromiseFulfilledResult<any>).value;
  //       return {
  //         id: value.Attributes.id, // Extract the id from the Attributes
  //         deletedAt: value.Attributes.deletedAt // Extract the deletedAt timestamp from the Attributes
  //       };
  //     });

  // return {
  //   success: true,
  //   message: 'Datasets processed for soft deletion.',
  //   datasets: successfulUpdates // Include the id and deletedAt in the response
  // };
  //   } catch (error) {
  //     console.error('Error during soft deletion of datasets:', error);
  //     throw new Error(`Unable to soft delete datasets: ${error.message}`);
  //   }
  }
  
  async softDeleteDataItemsById(datsetId: string, dataId: string): Promise<any> {
    // First, retrieve the current data to see if it's already marked as deleted.
    const getParams = {
      TableName: this.tableName,
      Key: {
        PK: `DATASET#${datsetId}`,
        SK: `DATA#${dataId}`
      }
    };
  
    let currentData;
    try {
      const getResult = await this.dynamodb.get(getParams).promise();
      currentData = getResult.Item;
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw new Error(`Unable to retrieve data: ${error.message}`);
    }
  
    // If the data is already marked as deleted, we return an appropriate message.
    if (currentData && currentData.deletedAt) {
      return {
        success: false,
        message: 'Data is already marked as deleted.',
        deletedAt: currentData.deletedAt
      };
    }
  
    // Proceed to mark the data as deleted if it's not already marked.
    try
    {
      const response = this.pineconeService.deleteVector(dataId);
      console.log(response);
    }
    catch (error) {
      console.log(error)
    }
    
    const updateParams = {
      TableName: this.tableName,
      Key: {
        PK: `DATASET#${datsetId}`,
        SK: `DATA#${dataId}`
      },
      UpdateExpression: 'set #deletedAt = :deletedAt',
      ExpressionAttributeNames: {
        '#deletedAt': 'deletedAt'
      },
      ExpressionAttributeValues: {
        ':deletedAt': new Date().toISOString()
      },
      ReturnValues: 'UPDATED_NEW'
    };
  
    try {
      const updateResult = await this.dynamodb.update(updateParams).promise();
      return {
        success: true,
        message: 'Data marked as deleted successfully.',
        dataId: dataId,
        deletedAt: updateResult.Attributes
      };
    } catch (error) {
      console.error('Error marking data as deleted:', error);
    }
  }

  async softDeleteDataItems(datasetId: string): Promise<any> {
    // First, query all data items within the dataset that are not already soft-deleted.
    const queryParams = {
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk and begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `DATASET#${datasetId}`,
        ':sk': 'DATA#'
      },
      FilterExpression: 'attribute_not_exists(deletedAt)'
    };
  
    try {
      const queryResult = await this.dynamodb.query(queryParams).promise();
      const dataItems = queryResult.Items;
  
      // If no data items to delete, return early.
      if (!dataItems || dataItems.length === 0) {
        return {
          success: true,
          message: 'No data items to soft delete.'
        };
      }
  
      // Perform soft delete on each data item.
      const updatePromises = dataItems.map((dataItem) => {

        try {
          const response = this.softDeleteDataItemsById(datasetId, dataItem.id)  
        } catch (error) {
          console.log(error);
        }
        
        
        
        const updateParams = {
          TableName: this.tableName,
          Key: {
            PK: dataItem.PK,
            SK: dataItem.SK
          },
          UpdateExpression: 'set #deletedAt = :deletedAt',
          ExpressionAttributeNames: {
            '#deletedAt': 'deletedAt'
          },
          ExpressionAttributeValues: {
            ':deletedAt': new Date().toISOString()
          },
          ReturnValues: 'ALL_NEW'
        };
  
        return this.dynamodb.update(updateParams).promise();
      });
  
      // Wait for all the soft delete operations to complete.
      const results = await Promise.allSettled(updatePromises);
  
      // Filter out successful updates and prepare the response.
      const successfulUpdates = results.filter(result => result.status === 'fulfilled').map((result) => {
        const value = (result as PromiseFulfilledResult<any>).value;
        return {
          id: value.Attributes.id, // Assuming the SK is in the format DATA#dataId, extract the dataId
          deletedAt: value.Attributes.deletedAt // Extract the deletedAt timestamp from the Attributes
        };
      });
  
      return {
        success: true,
        message: 'Data items processed for soft deletion.',
        dataItems: successfulUpdates // Include the id and deletedAt in the response
      };
    } catch (error) {
      console.error('Error during soft deletion of data items:', error);
      throw new Error(`Unable to soft delete data items: ${error.message}`);
    }
  }
  
}