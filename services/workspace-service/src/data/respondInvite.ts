import { Membership } from '../entities/membership';
import { Role } from '../dtos/workspace.dto';
import { dynamoDB } from '../utils/db';
import { HttpStatusCode } from '../utils/constants';

export const respondInvite = async (membership: Membership) => {
  // TODO: Append User record

  const paramsMembership = {
    TableName: process.env.TABLE_NAME as string,
    Key: {
      ...membership.key(),
    },
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

  try {
    dynamoDB
      .transactWrite({
        TransactItems: [
          {
            Update: paramsMembership,
          },
        ],
      })
      .promise();

    return {
      membership,
      statusCode: HttpStatusCode.OK,
    };
  } catch (error: any) {
    console.log(error);

    let errorMessage = 'Could not accept invite.';
    let statusCode = HttpStatusCode.BAD_REQUEST;  

    if (error.code === 'TransactionCanceledException') {
      if (error.cancellationReasons[0].Code === 'ConditionalCheckFailed') {
        errorMessage = 'User already a member of workspace with this name.';
        statusCode = HttpStatusCode.CONFLICT;
      }
    }

    return {
      error: errorMessage,
      statusCode,
    };
  }
};
