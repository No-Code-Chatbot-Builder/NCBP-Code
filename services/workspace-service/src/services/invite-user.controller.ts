import { AddUserToWorkspaceRequest } from '../dtos/request.dto';
import { inviteUser } from '../data/inviteUser';
import { Membership } from '../entities/membership';
import { Role } from '../dtos/workspace.dto';
import { sendEmail } from '../utils/helpers';
import { getUserByEmail } from '../data/getUserByEmail';
import { HttpStatusCode } from '../utils/constants';

export const inviteUserHandler = async (input: AddUserToWorkspaceRequest) => {
  const { user, error: err } = await getUserByEmail(input.userEmail);

  if (!user || err) {
    return {
      statusCode: HttpStatusCode.NOT_FOUND,
      body: JSON.stringify({ error: err }),
    };
  }

  const queryMembership = new Membership({
    userId: user.userId,
    userEmail: input.userEmail,
    workspaceName: input.workspaceName,
    role: Role.PENDING,
    createdAt: new Date().toISOString(),
  });

  const { error, membership, statusCode } = await inviteUser(queryMembership);

  // TODO: enable when SES is out of sandbox
  // if (!error)
  //   await sendEmail(input.userEmail, input.workspaceName);

  const body = error ? JSON.stringify({ error }) : JSON.stringify({ membership });

  return {
    statusCode,
    body,
  };
};
