import { Membership } from '../entities/membership';
import { Role } from '../dtos/workspace.dto';
import { User } from '../entities/user';
import { DEFAULT_MEMBERSHIP } from '../utils/constants';
import { listInvites } from '../data/listInvites';

export const listInvitesHandler = async (user: User) => {
    const queryMembership = new Membership({
        ...DEFAULT_MEMBERSHIP,
        userId: user.userId,
        userEmail: user.email,
        role: Role.PENDING,
    });

  const { error, membership, statusCode } = await listInvites(queryMembership);

  const body = error ? JSON.stringify({ error }) : JSON.stringify({ membership });

  return {
    statusCode,
    body,
  };
};
