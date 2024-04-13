import { Membership } from '../entities/membership';
import { Workspace } from '../entities/workspace';
import { IWorkspace } from '../dtos/workspace.dto';
import { dynamoDB } from '../utils/db';
import { HttpStatusCode } from '../utils/constants';

export const deleteWorkspace = async (workspace: Workspace) => {
  const queryParams = {
    TableName: process.env.TABLE_NAME as string,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': workspace.pk(),
    },
  };

  try {
    const results = await dynamoDB.query(queryParams).promise();
    
    if (!results.Items) {
      return {
        statusCode: HttpStatusCode.NOT_FOUND,
        error: 'Workspace not found.',
      };
    }

    // TODO: delete all bots

    // TODO: delete all datasets

    const items = results.Items;
    const workspace = items[items.length - 1] as IWorkspace;

    items.map(async (item) => {
      const deleteParams = {
        TableName: process.env.TABLE_NAME as string,
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
        ReturnValues: 'ALL_OLD',
      };

      await dynamoDB.delete(deleteParams).promise();
    });
    console.log(Workspace.fromItem(workspace))
    return {
        workspace: Workspace.fromItem(workspace),
        statusCode: HttpStatusCode.NO_CONTENT
    };
  } catch (error: any) {
    console.log('Error deleting workspace');
    console.log(error);
    let errorMessage = 'Could not update workspace';
    let statusCode = HttpStatusCode.BAD_REQUEST;
    // If it's a condition check violation, we'll try to indicate which condition failed.
    if (error.code === 'ConditionalCheckFailedException') {
      errorMessage = 'Workspace does not exist';
      statusCode = HttpStatusCode.NOT_FOUND;
    }
    return {
      error: errorMessage,
      statusCode
    };
  }
};
