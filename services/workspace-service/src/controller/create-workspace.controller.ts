import { v4 as uuidv4 } from 'uuid';

import { CreateWorkspaceRequest } from '../interfaces/request.interface';
import { Workspace } from '../entities/workspace';
import { createWorkspace } from '../data/createWorkspace';


export const createWorkspaceHandler = async (input: CreateWorkspaceRequest) => {
  console.log('input', input)
  const workspace = new Workspace({
    id: uuidv4(),
    name: input.name,
    admin: [{
      id: input.userId,
      email: input.userEmail
    }],
    website: input.website,
    description: input.description
  })

  const { error } = await createWorkspace(workspace)

  const statusCode = error ? 500 : 200
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ workspace })

  return {
    statusCode,
    body
  }
};


