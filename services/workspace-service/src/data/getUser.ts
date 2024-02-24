
import { User } from "../entities/user";
import { IUser } from "../dtos/user.dto";
import { dynamoDB } from "../utils/db";

export const getUser = async (user: User) => {
  const params = {
    TableName: process.env.TABLE_NAME as string,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': user.pk(),
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
