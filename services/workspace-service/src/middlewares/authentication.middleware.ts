import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DEFAULT_USER, HttpStatusCode } from '../utils/constants';
import { User } from '../entities/user';
import { getUser } from '../data/getUser';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { SimpleJwksCache } from 'aws-jwt-verify/jwk';
import { SimpleJsonFetcher } from 'aws-jwt-verify/https';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Unauthorized - Bearer token is missing' });
  }

  try {
    const decoded = await verifyToken(token);

    // if (req.headers['x-user-id'] !== decoded.sub) {
    //   throw new Error('UserIds do not match');
    // }

    const queryUser = new User({
      ...DEFAULT_USER,
      id: decoded.sub as string,
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
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'Unauthorized - ' + error });
  }
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
