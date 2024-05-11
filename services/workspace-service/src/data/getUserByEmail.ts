import { User } from '../entities/user';
import { IUser } from '../dtos/user.dto';
import { dynamoDB } from '../utils/db';

export const getUserByEmail = async (userEmail: string) => {
  const params = {
    TableName: process.env.TABLE_NAME as string,
    IndexName: 'GSIInverted',
    KeyConditionExpression: 'SK = :sk and begins_with(PK, :pk)',
    ExpressionAttributeValues: {
      ':sk': `USEREMAIL#${userEmail}`,
      ':pk': 'USER#',
    },
  };

  try {
    const result = await dynamoDB.query(params).promise();
    if (!result.Items) {
      return {
        error: 'user not found.',
      };
    }
    return {
      user: new User(result.Items[0] as IUser),
    };
  } catch (error: any) {
    console.log(error);
    return {
      error: 'Could not get user.',
    };
  }
};
