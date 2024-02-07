import { User } from '../entities/user';
import { dynamoDB } from '../utils/db';

export const createUser = async (user: User) => {


  const paramsWorkspace = {
    TableName: process.env.TABLE_NAME as string,
    Item: user.toItem(),
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
  };


  try {
    await dynamoDB
      .transactWrite({
        TransactItems: [
          {
            Put: paramsWorkspace,
          },
        ],
      })
      .promise();

    return {
      user,
    };
  } catch (error: any) {
    console.log(error);

    let errorMessage = 'Could not create user.';

    if (error.code === 'TransactionCanceledException') {
      if (error.cancellationReasons[0].Code === 'ConditionalCheckFailed') {
        errorMessage = 'user with this name already exists.';
      }
    }

    return {
      error: errorMessage,
    };
  }
};
