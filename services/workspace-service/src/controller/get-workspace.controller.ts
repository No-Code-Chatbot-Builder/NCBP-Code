import { getWorkspace } from '../data/getWorkspace';
import { Workspace } from '../entities/workspace';
import { GetWorkspaceRequest } from '../interfaces/request.interface';

export const getWorkspaceHandler = async (input: GetWorkspaceRequest) => {
const queryWorkspace = new Workspace({
    name: input.workspaceName,
    id: '',
    admin: [
        {
            id: input.userId,
            email: '',
        },
    ],
});

const { workspace, error } = await getWorkspace(queryWorkspace);

const statusCode = error ? 500 : 200;
const body = error ? JSON.stringify({ error }) : JSON.stringify({ workspace });

  return {
    statusCode,
    body,
  };
};
