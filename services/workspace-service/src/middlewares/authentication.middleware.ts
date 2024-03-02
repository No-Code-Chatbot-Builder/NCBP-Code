import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DEFAULT_USER, HttpStatusCode } from '../utils/constants';
import { User } from '../entities/user';
import { getUser } from '../data/getUser';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Unauthorized - Bearer token is missing' });
  }

  try {
    const decoded = await verifyToken(token);

    if (req.headers['x-user-id'] !== decoded.sub) {
      throw new Error('UserIds do not match');
    }

    const queryUser = new User({
      ...DEFAULT_USER,
      userId: req.headers['x-user-id'] as string,
    });

    const { error, user } = await getUser(queryUser);
    if (error) {
      throw new Error(error);
    }

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error: any) {
    console.error(error);
    res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Unauthorized - ' + error.message });
  }
};

const verifyToken: (token: string) => Promise<jwt.JwtPayload> = async (token: string) => {
  // TODO: verify token using cognito
  let decoded = jwt.decode(token);
  if (!decoded) {
    throw new Error('Invalid token');
  }

  decoded = decoded as jwt.JwtPayload;
  if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    throw new Error('Token expired');
  }

  return decoded;
};
