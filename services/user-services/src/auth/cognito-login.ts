import { Request, Response } from 'express';
import { CognitoIdentityServiceProvider, poolData } from '../../cognito';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const loginHandler = (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('email:', email);
  console.log('password:', password);

  const clientId = poolData.ClientId;
  const clientSecret = '1iho4rbr5g0l82bfe09rrkqopv2gla36d2qphsrmtn2sdl4l1ues'; // Replace with your actual client secret

  // Calculate SECRET_HASH
  const secretHash = crypto.createHmac('SHA256', clientSecret)
    .update(email + clientId)
    .digest('base64');

  const loginParams: AWS.CognitoIdentityServiceProvider.InitiateAuthRequest = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash, // Include SECRET_HASH
    },
  };

  CognitoIdentityServiceProvider.initiateAuth(loginParams, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const jwtToken = generateJwtToken(data.AuthenticationResult!.IdToken);

    // Return the token in the response
    res.status(200).json({ token: jwtToken });
  });
};

const generateJwtToken = (idToken: string | undefined) => {
  if (!idToken) {
    throw new Error('ID token is undefined');
  }

  // Replace 'your-secret-key' with your actual secret key used to sign JWT tokens
  const secretKey = '1s48uefv2udvsgpuu37b973htc5q2ncce3ttc9rq9nop1cr030n3';

  try {
    // Decode the Cognito ID token to extract user information
    const decodedToken = jwt.decode(idToken, { complete: true });

    if (!decodedToken || !decodedToken.header || !decodedToken.header.alg) {
      throw new Error('Unable to determine algorithm from ID token');
    }

    const algorithm = decodedToken.header.alg;

    // Sign a new JWT token containing the filtered user information
    const jwtToken = jwt.sign(decodedToken.payload, secretKey, { algorithm, expiresIn: '1h' });

    return jwtToken;
  } catch (error) {
    console.error('Error decoding or signing JWT token:', error);
    throw new Error('Failed to generate JWT token');
  }
};

