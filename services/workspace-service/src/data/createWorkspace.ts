import { Workspace } from '../entities/workspace';
import { dynamoDB } from '../utils/db';

export const createWorkspace = async (workspace: Workspace) => {
  const params = {
    TableName: process.env.TABLE_NAME as string,
    Item: workspace.toItem(),
    ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)',
  };
  try {
    await dynamoDB.put(params).promise();

    return {
        workspace
    }
  }
  catch (error: any) {
    console.log(error);

    let errorMessage = "Could not create workspace.";
    
    if (error.code === 'ConditionalCheckFailedException') {
        errorMessage = "Workspace name must be unique.";
    }

    return {
        error: errorMessage
    }

  }
  
};