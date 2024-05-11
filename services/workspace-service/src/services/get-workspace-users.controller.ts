import { getWorkspace } from '../data/getWorkspace';
import { Workspace } from '../entities/workspace';
import { GetWorkspaceRequest } from '../dtos/request.dto';
import { DEFAULT_WORKSPACE } from '../utils/constants';

export const getWorkspaceUsersHandler = async (input: GetWorkspaceRequest) => {
const queryWorkspace = new Workspace({
    ...DEFAULT_WORKSPACE,
    name: input.workspaceName,
});

const { workspace, error, statusCode } = await getWorkspace(queryWorkspace);

// const statusCode = error ? 500 : 200;
const body = error ? JSON.stringify({ error }) : JSON.stringify({ workspace });

  return {
    statusCode,
    body,
  };
};
