import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user';
import { DEFAULT_USER, HttpStatusCode } from '../utils/constants';
import { Role } from '../dtos/workspace.dto';
import { getUser } from '../data/getUser';

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  const input = req.body;
  const queryUser = new User({
    ...DEFAULT_USER,
    userId: (req).user.userId
  });

  const { error, user } = await getUser(queryUser);
  if (error) {
    throw new Error(error);
  }

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.workspaces.hasOwnProperty(input.workspaceName.toLowerCase())) {
    return res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Unauthorized - User not part of workspace' });
  }

  const role = user.workspaces[input.workspaceName.toLowerCase()];
  if (role !== Role.ADMIN && role !== Role.OWNER) {
    return res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Unauthorized - User does not have permission' });
  }

  next();
};
