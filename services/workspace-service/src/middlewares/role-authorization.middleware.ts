import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user';
import { DEFAULT_USER, HttpStatusCode } from '../utils/constants';
import { Role } from '../dtos/workspace.dto';
import { getUser } from '../data/getUser';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { SimpleJwksCache } from 'aws-jwt-verify/jwk';
import { SimpleJsonFetcher } from 'aws-jwt-verify/https';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  const input = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Unauthorized - Bearer token is missing' });
  }

  const decoded = await verifyToken(token);

  const queryUser = new User({
    ...DEFAULT_USER,
    userId: decoded.sub as string,
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

const verifyToken: (token: string) => Promise<CognitoIdTokenPayload> = async (token: string) => {
  const verifier = CognitoJwtVerifier.create(
    {
      userPoolId: process.env.COGNITO_USER_POOL_ID as string,
      tokenUse: 'id',
      clientId: process.env.COGNITO_CLIENT_ID,
    },
    {
      jwksCache: new SimpleJwksCache({
        fetcher: new SimpleJsonFetcher({
          defaultRequestOptions: {
            responseTimeout: 3000,
          },
        }),
      }),
    },
  );

  try {
    const payload = await verifier.verify(token, {
      clientId: process.env.COGNITO_CLIENT_ID as string,
    });

    return payload;
  } catch (error) {
    console.log('Error:', error);
    console.log('Token not valid!');
    throw new Error('Invalid token');
  }
};
