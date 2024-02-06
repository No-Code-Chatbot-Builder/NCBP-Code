import { Workspace } from "../entities/workspace";
import { IWorkspace } from "../interfaces/workspace.interface";
import { dynamoDB } from "../utils/db";

export const getWorkspace = async (workspace: Workspace) => {
  const params = {
    TableName: process.env.TABLE_NAME as string,
    Key: { ...workspace.key() },
  };

  console.log('params', params);
  try {
    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      return {
        error: 'Workspace not found.',
      };
    }
    return {
      workspace: new Workspace(result.Item as IWorkspace),
    };
  } catch (error: any) {
    console.log(error);
    return {
      error: 'Could not get workspace.',
    };
  }
};
