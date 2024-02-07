import { Membership } from '../entities/membership';
import { dynamoDB } from '../utils/db';

export const inviteUser = async (membership: Membership) => {
  // TODO: Append User record


  const paramsMembership = {
    TableName: process.env.TABLE_NAME as string,
    Item: membership.toItem(),
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
  };

  try {
    await dynamoDB
      .transactWrite({
        TransactItems: [
          {
            Put: paramsMembership,
          },
        ],
      })
      .promise();

    return {
      membership,
    };
  } catch (error: any) {
    console.log(error);

    let errorMessage = 'Could not create workspace.';

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
