import { AddUserToWorkspaceRequest } from '../interfaces/request.interface';
import { inviteUser } from '../data/inviteUser';
import { Membership } from '../entities/membership';
import { Role } from '../interfaces/workspace.interface';

export const inviteUserHandler = async (input: AddUserToWorkspaceRequest) => {
  const membership = new Membership({
    userId: input.userId,
    userEmail: input.userEmail,
    workspaceName: input.workspaceName,
    role: Role.PENDING,
    createdAt: new Date().toISOString(),
  });

  const { error } = await inviteUser(membership);

  // TODO: notify user via email

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ membership });

  return {
    statusCode,
    body,
  };
};
