import { RespondToWorkspaceInviteRequest } from '../interfaces/request.interface';

import { Membership } from '../entities/membership';
import { Response, Role } from '../interfaces/workspace.interface';
import { acceptInvite } from '../data/acceptInvite';
import { DEFAULT_MEMBERSHIP } from '../utils/constants';

export const respondInviteHandler = async (input: RespondToWorkspaceInviteRequest) => {
  const queryMembership = new Membership({
    ...DEFAULT_MEMBERSHIP,
    userId: input.userId,
    workspaceName: input.workspaceName,
    role: input.response === Response.ACCEPTED ? Role.MEMBER : Role.REJECTED
  })

  const { error, membership } = await acceptInvite(queryMembership);

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ membership });

  return {
    statusCode,
    body,
  };
};
