import {  DeleteWorkspaceRequest } from '../interfaces/request.interface';
import { Workspace } from '../entities/workspace';
import { deleteWorkspace } from '../data/deleteWorkspace';
import { DEFAULT_WORKSPACE } from '../utils/constants';


export const deleteWorkspaceHandler = async (input: DeleteWorkspaceRequest) => {
  const queryWorkspace = new Workspace({
    ...DEFAULT_WORKSPACE,
    name: input.workspaceName,
  })

  const { error, workspace } = await deleteWorkspace(queryWorkspace)

  const statusCode = error ? 500 : 200
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ workspace })

  return {
    statusCode,
    body
  }
};


