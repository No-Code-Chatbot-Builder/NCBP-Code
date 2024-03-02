import { Membership } from '../entities/membership';
import { User } from '../entities/user';
import { DEFAULT_USER, HttpStatusCode } from '../utils/constants';
import { dynamoDB } from '../utils/db';

export const removeUser = async (membership: Membership) => {
  const user = new User({
    ...DEFAULT_USER,
    userId: membership.userId,
    email: membership.userEmail,
  });

  const paramsUser = {
    TableName: process.env.TABLE_NAME as string,
    Key: user.key(),
    UpdateExpression: 'remove #workspaces.#workspaceName',
    ExpressionAttributeNames: {
      '#workspaces': 'workspaces',
      '#workspaceName': membership.workspaceName.toLowerCase(),
    },
    ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)',
  };

  const paramsMembership = {
    TableName: process.env.TABLE_NAME as string,
    Key: membership.key(),
    ReturnValues: 'ALL_OLD',
  };

  try {
    await dynamoDB
      .transactWrite({
        TransactItems: [
          {
            Update: paramsUser,
          },
          {
            Delete: paramsMembership,
          },
        ],
      })
      .promise();

    return {
      membership,
      statusCode: HttpStatusCode.NO_CONTENT,
    };
  } catch (error: any) {
    console.log('Error removing user from workspace');
    console.log(error);
    let errorMessage = 'Could not remove uer from workspace';
    let statusCode = HttpStatusCode.BAD_REQUEST;
    // If it's a condition check violation, we'll try to indicate which condition failed.
    if (error.code === 'ConditionalCheckFailedException') {
      errorMessage = 'User doesnot exist in workspace';
      statusCode = HttpStatusCode.NOT_FOUND;
    }
    return {
      error: errorMessage,
      statusCode,
    };
  }
};
