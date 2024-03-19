import { Membership } from '../entities/membership';
import { HttpStatusCode } from '../utils/constants';
import { dynamoDB } from '../utils/db';

export const inviteUser = async (membership: Membership) => {
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
      statusCode: HttpStatusCode.OK,
    };
  } catch (error: any) {
    console.log(error);

    let errorMessage = 'Could not create workspace.';
    let statusCode = HttpStatusCode.BAD_REQUEST;

    if (error.code === 'TransactionCanceledException') {
      if (error.CancellationReasons[0].Code === 'ConditionalCheckFailed') {
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
