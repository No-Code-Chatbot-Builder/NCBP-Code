import { AddUserToWorkspaceRequest } from '../interfaces/request.interface';
import { inviteUser } from '../data/inviteUser';
import { Membership } from '../entities/membership';
import { Role } from '../interfaces/workspace.interface';
import { sendEmail } from '../utils/helpers';

export const inviteUserHandler = async (input: AddUserToWorkspaceRequest) => {
  const queryMembership = new Membership({
    userId: input.userId,
    userEmail: input.userEmail,
    workspaceName: input.workspaceName,
    role: Role.PENDING,
    createdAt: new Date().toISOString(),
  });

  const { error, membership } = await inviteUser(queryMembership);

  await sendEmail(input.userEmail, input.workspaceName);

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ membership });

  return {
    statusCode,
    body,
  };
};
