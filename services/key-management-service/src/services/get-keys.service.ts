import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '../utils/db';
import { GetKeysRequest } from '../dtos/request.dto';

export const getKeysHandler = async (input: GetKeysRequest) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Key fetched successfully' }),
  };
  //   const params = {
  //     TableName: 'Keys',
  //     KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
  //     ExpressionAttributeValues: {
  //       ':pk': input.userId,
  //       ':sk': 'KEY#',
  //     },
  //   };

  //   try {
  //     const data = await dynamoDB.send(new QueryCommand(params));
  //     return {
  //       statusCode: 200,
  //       body: JSON.stringify(data.Items),
  //     };
  //   } catch (error) {
  //     return {
  //       statusCode: 500,
  //       body: JSON.stringify({ message: 'Internal server error' }),
  //     };
  //   }
};
