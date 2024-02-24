import {  UpdateWorkspaceRequest } from '../dtos/request.dto';
import { Workspace } from '../entities/workspace';
import { updateWorkspace } from '../data/updateWorkspace';


export const updateWorkspaceHandler = async (input: UpdateWorkspaceRequest) => {
  const workspace = new Workspace({
    name: input.workspaceName,
    owner: {
      id: input.userId,
      email: input.userEmail
    },
    members: input.members,
    website: input.website,
    description: input.description,
    createdAt: input.createdAt,
    updatedAt: new Date().toISOString()
  })

  const { error, statusCode } = await updateWorkspace(workspace)

  // const statusCode = error ? 500 : 200
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ workspace })

  return {
    statusCode,
    body
  }
};


