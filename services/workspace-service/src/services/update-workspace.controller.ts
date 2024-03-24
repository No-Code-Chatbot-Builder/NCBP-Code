import {  UpdateWorkspaceRequest } from '../dtos/request.dto';
import { Workspace } from '../entities/workspace';
import { updateWorkspace } from '../data/updateWorkspace';
import { User } from '../entities/user';


export const updateWorkspaceHandler = async (input: UpdateWorkspaceRequest, user: User) => {
  const workspace = new Workspace({
    name: input.workspaceName,
    owner: {
      id: user.userId,
      email: user.email
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


