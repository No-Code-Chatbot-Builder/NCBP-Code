import { Membership } from '../entities/membership';
import { Workspace } from '../entities/workspace';
import { Role } from '../dtos/workspace.dto';
import { dynamoDB } from '../utils/db';
import { HttpStatusCode } from '../utils/constants';

export const createWorkspace = async (workspace: Workspace) => {
  // TODO: Append User record

  const membership = new Membership({
    workspaceName: workspace.name,
    userId: workspace.owner.id,
    userEmail: workspace.owner.email,
    role: Role.OWNER,
    createdAt: new Date().toISOString(),
  });

  const paramsWorkspace = {
    TableName: process.env.TABLE_NAME as string,
    Item: workspace.toItem(),
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
  };

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
            Put: paramsWorkspace,
          },
          {
            Put: paramsMembership,
          },
        ],
      })
      .promise();

    return {
      workspace,
      statusCode: HttpStatusCode.CREATED,
    };
  } catch (error: any) {
    console.log(error);

    let errorMessage = 'Could not create workspace.';
    let statusCode = HttpStatusCode.BAD_REQUEST;

    if (error.code === 'TransactionCanceledException') {
      if (error.cancellationReasons[0].Code === 'ConditionalCheckFailed') {
        errorMessage = 'Workspace with this name already exists.';
        statusCode = HttpStatusCode.CONFLICT;
      } else if (error.cancellationReasons[1].Code === 'ConditionalCheckFailed') {
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
