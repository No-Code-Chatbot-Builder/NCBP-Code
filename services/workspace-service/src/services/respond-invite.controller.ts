import { RespondToWorkspaceInviteRequest } from '../dtos/request.dto';

import { Membership } from '../entities/membership';
import { Response, Role } from '../dtos/workspace.dto';
import { respondInvite } from '../data/respondInvite';
import { DEFAULT_MEMBERSHIP } from '../utils/constants';
import { User } from '../entities/user';

export const respondInviteHandler = async (input: RespondToWorkspaceInviteRequest, user: User) => {
  const queryMembership = new Membership({
    ...DEFAULT_MEMBERSHIP,
    userId: user.userId,
    userEmail: user.email,
    workspaceName: input.workspaceName,
    role: input.response === Response.ACCEPTED ? Role.MEMBER : Role.REJECTED
  })

  const { error, membership, statusCode } = await respondInvite(queryMembership);

  // const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ membership });

  return {
    statusCode,
    body,
  };
};