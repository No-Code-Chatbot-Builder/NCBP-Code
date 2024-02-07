import { v4 as uuidv4 } from 'uuid';

import { CreateWorkspaceRequest } from '../interfaces/request.interface';
import { Workspace } from '../entities/workspace';
import { createWorkspace } from '../data/createWorkspace';


export const createWorkspaceHandler = async (input: CreateWorkspaceRequest) => {
  const workspace = new Workspace({
    name: input.name,
    owner: {
      id: input.userId,
      email: input.userEmail
    },
    members: 1,
    website: input.website,
    description: input.description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const { error } = await createWorkspace(workspace)

  const statusCode = error ? 500 : 200
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ workspace })

  return {
    statusCode,
    body
  }
};


