import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    private readonly dynamoDb: AWS.DynamoDB.DocumentClient;
    private tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME');
    

    constructor(private configService: ConfigService,) {
      
      this.dynamoDb = new AWS.DynamoDB.DocumentClient(
        {
            region: 'us-east-1'
        }
      );
    }
  
    
    
    async getUserById(id: string, email: string): Promise<any> {
        const params = {
          TableName: this.tableName,
          Key: {
            'PK': `USER#${id}`,
            'SK': `USEREMAIL#${email}`
          }
        };
  
        try {
          const data = await this.dynamoDb.get(params).promise(); //get is used for retreiving 1 //data holds result of the get/scan operation
          return data.Item; //it is an array of items. it holds the actual data
        } catch (error) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(error, null, 2));
          throw error;
        }
      }

      async updateUserFields(id: string, email: string, fieldsToUpdate: { [key: string]: any }): Promise<any> {
        //keys are strings and values can be of any type in fieldstoUpdate
      const updateExpressionArray = [];
      for (const key of Object.keys(fieldsToUpdate)) { 
          const updateExpressionPart = `#${key} = :${key}`; 
          updateExpressionArray.push(updateExpressionPart); 
      }
      const updateExpression = updateExpressionArray.join(', '); 

      // Creating expression attribute names for DynamoDB update operation
      const expressionAttributeNames = {}; 
      for (const key of Object.keys(fieldsToUpdate)) { 
          const attributeName = `#${key}`; // Create an attribute name placeholder for the current key
          expressionAttributeNames[attributeName] = key; 
      }

      // Creating expression attribute values for DynamoDB update operation
      const expressionAttributeValues = {}; // Initialize an empty object to store expression attribute values




const keys = Object.keys(fieldsToUpdate);
for (const key of keys) {
  const value = fieldsToUpdate[key];

  let sanitizedValue = value;

  // Check if the value is not null or undefined
  if (sanitizedValue === null || sanitizedValue === undefined) {
    // Handle null or undefined values
    throw new Error(`Value for field '${key}' cannot be null or undefined.`);
  }

  // Convert empty strings to null
  if (typeof sanitizedValue === 'string' && sanitizedValue.trim() === '') {
    sanitizedValue = null;
  }

  // Assign the sanitized value to the expression attribute values
  expressionAttributeValues[`:${key}`] = sanitizedValue;
}

const params = {
  TableName: this.tableName,
  Key: {
    'PK': `USER#${id}`,
    'SK': `USEREMAIL#${email}`
  },
  UpdateExpression: `SET ${updateExpression}`,
  ExpressionAttributeNames: expressionAttributeNames,
  ExpressionAttributeValues: expressionAttributeValues,
  ReturnValues: 'ALL_NEW' // Return the updated item
};

        try {
            const data = await this.dynamoDb.update(params).promise();
            return data.Attributes;
        } catch (error) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(error, null, 2));
            throw error;
        }
    }
}