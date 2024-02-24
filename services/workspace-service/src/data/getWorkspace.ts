import { Workspace } from "../entities/workspace";
import { IWorkspace } from "../dtos/workspace.dto";
import { dynamoDB } from "../utils/db";
import { HttpStatusCode } from "../utils/constants";

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
        statusCode: HttpStatusCode.NOT_FOUND,
        error: 'Workspace not found.',
      };
    }
    return {
      workspace: new Workspace(result.Item as IWorkspace),
      statusCode: HttpStatusCode.OK,
    };
  } catch (error: any) {
    console.log(error);
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      error: 'Could not get workspace.',
    };
  }
};
