
import {  GetWorkspaceUsersRequest } from '../dtos/request.dto';
import { DEFAULT_MEMBERSHIP } from '../utils/constants';
import { Membership } from '../entities/membership';
import { getWorkspaceUsers } from '../data/getWorkspaceUsers';

export const listWorkspaceUsersHandler = async (input: GetWorkspaceUsersRequest) => {
  const queryMembership = new Membership({
    ...DEFAULT_MEMBERSHIP,
    workspaceName: input.workspaceName,
  });

  const { membership, error, statusCode } = await getWorkspaceUsers(queryMembership);

  const body = error ? JSON.stringify({ error }) : JSON.stringify({ membership });

  return {
    statusCode,
    body,
  };
};
