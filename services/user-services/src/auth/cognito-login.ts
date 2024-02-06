import { Request, Response } from 'express';
import { CognitoIdentityServiceProvider, poolData } from '../../cognito';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const loginHandler = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const clientId = poolData.ClientId;
  const clientSecret = '1iho4rbr5g0l82bfe09rrkqopv2gla36d2qphsrmtn2sdl4l1ues'; // Replace with your actual client secret

  const secretHash = crypto.createHmac('SHA256', clientSecret)
    .update(email + clientId)
    .digest('base64');

  const authParams: AWS.CognitoIdentityServiceProvider.InitiateAuthRequest = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
  };

  CognitoIdentityServiceProvider.initiateAuth(authParams, (err, data) => {
    if (err) {
      console.error(err);
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      console.log(data);

      if (data.AuthenticationResult?.IdToken) {
        const decodedToken = jwt.decode(data.AuthenticationResult.IdToken, { complete: true });

        // Extract user attributes from the decoded token
        const userAttributes = decodedToken?.payload;

        res.status(200).json({ message: 'User authenticated successfully', userAttributes });
      } else {
        res.status(401).json({ error: 'Authentication failed' });
      }
    }
  });
};
