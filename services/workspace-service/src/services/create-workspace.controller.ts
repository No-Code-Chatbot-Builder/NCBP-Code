import { v4 as uuidv4 } from 'uuid';

import { CreateWorkspaceRequest } from '../dtos/request.dto';
import { Workspace } from '../entities/workspace';
import { createWorkspace } from '../data/createWorkspace';
import { HttpStatusCode } from '../utils/constants';
import { User } from '../entities/user';


export const createWorkspaceHandler = async (input: CreateWorkspaceRequest, user: User) => {
  const workspace = new Workspace({
    name: input.name,
    owner: {
      id: user.userId,
      email: user.email
    },
    members: 1,
    website: input.website,
    description: input.description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const { error, statusCode } = await createWorkspace(workspace)

  const body = error ? JSON.stringify({ error }) : JSON.stringify({ workspace })

  return {
    statusCode,
    body
  }
};


