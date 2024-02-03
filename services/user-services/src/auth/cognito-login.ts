import { Request, Response } from 'express';
import { CognitoIdentityServiceProvider, poolData } from '../../cognito';
import jwt from 'jsonwebtoken';

export const loginHandler = (req: Request, res: Response) => {
  const { email, password } = req.body;

  const loginParams: AWS.CognitoIdentityServiceProvider.InitiateAuthRequest = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: poolData.ClientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  CognitoIdentityServiceProvider.initiateAuth(loginParams, (err, data) => {
    if (err) {
      console.error(err);
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      // Generate a JWT token
      const jwtToken = generateJwtToken(data.AuthenticationResult!.IdToken);
      
      // Return the token in the response
      res.status(200).json({ token: jwtToken });
    }
  });
};

const generateJwtToken = (idToken: string) => {
  // Replace 'your-secret-key' with your actual secret key used to sign JWT tokens
  const secretKey = 'your-secret-key';

  // Decode the Cognito ID token to extract user information
  const decodedToken = jwt.decode(idToken);

  // Sign a new JWT token containing the user information
  const jwtToken = jwt.sign(decodedToken, secretKey, { expiresIn: '1h' });

  return jwtToken;
};
