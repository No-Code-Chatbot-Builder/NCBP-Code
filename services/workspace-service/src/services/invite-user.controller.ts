import { AddUserToWorkspaceRequest } from '../dtos/request.dto';
import { inviteUser } from '../data/inviteUser';
import { Membership } from '../entities/membership';
import { Role } from '../dtos/workspace.dto';
import { sendEmail } from '../utils/helpers';

export const inviteUserHandler = async (input: AddUserToWorkspaceRequest) => {
  const queryMembership = new Membership({
    userId: input.userId,
    userEmail: input.userEmail,
    workspaceName: input.workspaceName,
    role: Role.PENDING,
    createdAt: new Date().toISOString(),
  });

  const { error, membership, statusCode } = await inviteUser(queryMembership);

  if (!error)
    await sendEmail(input.userEmail, input.workspaceName);

  const body = error ? JSON.stringify({ error }) : JSON.stringify({ membership });

  return {
    statusCode,
    body,
  };
};
