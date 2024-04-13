import { Membership } from '../entities/membership';
import { Role } from '../dtos/workspace.dto';
import { dynamoDB } from '../utils/db';
import { DEFAULT_USER, HttpStatusCode } from '../utils/constants';
import { User } from '../entities/user';

export const respondInvite = async (membership: Membership) => {

  const user = new User({
    ...DEFAULT_USER,
    id: membership.userId,
    email: membership.userEmail,
  });

  const paramsMembership = {
    TableName: process.env.TABLE_NAME as string,
    Key: membership.key(),
    UpdateExpression: 'set #role = :role',
    ExpressionAttributeNames: {
      '#role': 'role',
    },
    ExpressionAttributeValues: {
      ':role': membership.role,
    },
    ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)',
    ReturnValues: 'ALL_NEW',
  };

  const paramsUser = {
    TableName: process.env.TABLE_NAME as string,
    Key: user.key(),
    UpdateExpression: 'set #workspaces.#workspaceName = :role',
    ExpressionAttributeNames: {
      '#workspaces': 'workspaces',
      '#workspaceName': membership.workspaceName.toLowerCase(),
    },
    ExpressionAttributeValues: {
      ':role': membership.role,
    },
    // TODO: revert to attribute_exists(PK) AND attribute_exists(SK) after fixing the ses sandbox issue
    ConditionExpression: 'attribute_exists(PK) AND attribute_exists(SK)',
  };

  try {
    dynamoDB
      .transactWrite({
        TransactItems: [
          {
            Update: paramsMembership,
          },
          {
            Update: paramsUser,
          }
        ],
      })
      .promise();

    return {
      membership,
      statusCode: HttpStatusCode.OK,
    };
  } catch (error: any) {
    console.log(error.CancellationReasons);

    let errorMessage = 'Could not accept invite.';
    let statusCode = HttpStatusCode.BAD_REQUEST;  

    if (error.code === 'TransactionCanceledException') {
      if (error.CancellationReasons[0].Code === 'ConditionalCheckFailed') {
        errorMessage = 'User already a member of workspace with this name.';
        statusCode = HttpStatusCode.CONFLICT;
      }
      else if (error.CancellationReasons[1].Code === 'ConditionalCheckFailed') {
        errorMessage = 'User does not have an invite or does not exists';
        statusCode = HttpStatusCode.NOT_FOUND;
      }
    }

    return {
      error: errorMessage,
      statusCode,
    };
  }
};
