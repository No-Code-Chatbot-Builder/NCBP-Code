import { Request, Response } from 'express';
import jwt, { VerifyErrors, VerifyOptions } from 'jsonwebtoken';

interface TokenPayload {
  sub: string;
  email_verified: boolean;
  address: { formatted: string };
  birthdate: string;
  iss: string;
  'cognito:username': string;
  given_name: string;
  origin_jti: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  email: string;
}

export const getUserHandler = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  // Define verification options
  const verifyOptions: VerifyOptions & { complete: true } = {
    algorithms: ['HS256'], // Specify the algorithm used to sign the token
    complete: true, // Specify the decoding option
    // Other options if needed
  };

  // Verify and decode token asynchronously with a callback function
  jwt.verify(token, process.env.JWT_SECRET as string, verifyOptions, (err: VerifyErrors | null, decodedToken: object | undefined) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Proceed with further processing based on decoded token
    const tokenPayload = decodedToken as TokenPayload;
    // Your logic to handle the token payload...
    
    // Example: Return user information
    return res.status(200).json({ user: 'user details here' });
  });
};
