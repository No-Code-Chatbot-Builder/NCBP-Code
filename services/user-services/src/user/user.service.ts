import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class UserService {
    private readonly dynamoDb: AWS.DynamoDB.DocumentClient;
    

    constructor() {
      this.dynamoDb = new AWS.DynamoDB.DocumentClient(
        {
            region: 'us-east-1'
        }
      );
    }
  
    async getAllUsers(): Promise<any[]> {
      const params = {
        TableName: 'demoTable'
      };
  
      try {
        const data = await this.dynamoDb.scan(params).promise();
        return data.Items;
      } catch (error) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(error, null, 2));
        throw error;
      }
    }
    
    async getUserById(sub: string): Promise<any> {
        const params = {
          TableName: 'demoTable',
          Key: {
            'sub': sub
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

      async updateUserFields(sub: string, fieldsToUpdate: { [key: string]: any }): Promise<any> {
        //keys are strings and values can be of any type in fieldstoUpdate
      // Creating the update expression for DynamoDB update operation
      const updateExpressionArray = []; // Initialize an array to store update expression parts
      for (const key of Object.keys(fieldsToUpdate)) { // Loop through each key in fieldsToUpdate object
          const updateExpressionPart = `#${key} = :${key}`; // Create an update expression part for the current key
          updateExpressionArray.push(updateExpressionPart); // Add the update expression part to the array
      }
      const updateExpression = updateExpressionArray.join(', '); // Join the update expression parts into a single string

      // Creating expression attribute names for DynamoDB update operation
      const expressionAttributeNames = {}; // Initialize an empty object to store expression attribute names
      for (const key of Object.keys(fieldsToUpdate)) { // Loop through each key in fieldsToUpdate object
          const attributeName = `#${key}`; // Create an attribute name placeholder for the current key
          expressionAttributeNames[attributeName] = key; // Assign the attribute name placeholder to the corresponding key
      }

      // Creating expression attribute values for DynamoDB update operation
      const expressionAttributeValues = {}; // Initialize an empty object to store expression attribute values
      // (Further expansion may depend on how expressionAttributeValues is populated in your code)


// Iterate over the keys of the fieldsToUpdate object
const keys = Object.keys(fieldsToUpdate);
for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = fieldsToUpdate[key];

    // Perform validation or transformation on the value if needed
    let sanitizedValue = value;

    // Example validation: Check if the value is not null or undefined
    if (sanitizedValue === null || sanitizedValue === undefined) {
        // Handle null or undefined values
        throw new Error(`Value for field '${key}' cannot be null or undefined.`);
    }

    // Example validation: Convert empty strings to null
    if (typeof sanitizedValue === 'string' && sanitizedValue.trim() === '') {
        sanitizedValue = null;
    }

    // Assign the sanitized value to the expression attribute values
    expressionAttributeValues[`:${key}`] = sanitizedValue;
}

        const params = {
            TableName: 'demoTable',
            Key: {
                'sub': sub
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