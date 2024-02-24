import {  DeleteWorkspaceRequest, RemoveUserFromWorkspaceRequest } from '../dtos/request.dto';
import { Workspace } from '../entities/workspace';
import { DEFAULT_MEMBERSHIP, DEFAULT_WORKSPACE } from '../utils/constants';
import { Membership } from '../entities/membership';
import { removeUser } from '../data/removeUser';


export const removeUserHandler = async (input: RemoveUserFromWorkspaceRequest) => {
  const queryMembership = new Membership({
    ...DEFAULT_MEMBERSHIP,
    userId: input.userId,
    workspaceName: input.workspaceName,
  })

  const { error, membership, statusCode } = await removeUser(queryMembership)

  // const statusCode = error ? 500 : 200
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ membership })

  return {
    statusCode,
    body
  }
};


