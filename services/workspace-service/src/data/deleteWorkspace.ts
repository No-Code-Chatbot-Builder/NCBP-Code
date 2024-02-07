import { Membership } from '../entities/membership';
import { Workspace } from '../entities/workspace';
import { IWorkspace } from '../interfaces/workspace.interface';
import { dynamoDB } from '../utils/db';

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
        error: 'Workspace not found.',
      };
    }

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
        workspace: Workspace.fromItem(workspace)
    };
  } catch (error: any) {
    console.log('Error deleting workspace');
    console.log(error);
    let errorMessage = 'Could not update workspace';
    // If it's a condition check violation, we'll try to indicate which condition failed.
    if (error.code === 'ConditionalCheckFailedException') {
      errorMessage = 'Workspace does not exist';
    }
    return {
      error: errorMessage,
    };
  }
};
