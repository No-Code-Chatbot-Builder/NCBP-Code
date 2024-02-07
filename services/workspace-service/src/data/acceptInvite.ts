import { Membership } from '../entities/membership';
import { Role } from '../interfaces/workspace.interface';
import { dynamoDB } from '../utils/db';

export const acceptInvite = async (membership: Membership) => {
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
    };
  } catch (error: any) {
    console.log(error);

    let errorMessage = 'Could not accept invite.';

    if (error.code === 'TransactionCanceledException') {
      if (error.cancellationReasons[0].Code === 'ConditionalCheckFailed') {
        errorMessage = 'User already a member of workspace with this name.';
      }
    }

    return {
      error: errorMessage,
    };
  }
};
