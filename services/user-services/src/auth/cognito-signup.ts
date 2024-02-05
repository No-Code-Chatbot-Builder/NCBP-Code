import { Request, Response } from 'express';
import { CognitoIdentityServiceProvider, poolData } from '../../cognito';
import crypto from 'crypto';

export const signUpHandler = (req: Request, res: Response) => {
  const { given_name, email, birthdate, address } = req.body;

  console.log(given_name);
  console.log(email);
  console.log(birthdate);
  console.log(address);

  if (!given_name) {
    return res.status(400).json({ error: 'The attribute given_name is required.' });
  }

  const clientId = poolData.ClientId;
  const clientSecret = '1iho4rbr5g0l82bfe09rrkqopv2gla36d2qphsrmtn2sdl4l1ues'; // Replace with your actual client secret

  const secretHash = crypto.createHmac('SHA256', clientSecret)
    .update(email + clientId)
    .digest('base64');

  const signUpParams: AWS.CognitoIdentityServiceProvider.SignUpRequest = {
    ClientId: clientId,
    Username: email,
    Password: "Password123!",
    SecretHash: secretHash,
    UserAttributes: [
      {
        Name: 'given_name',
        Value: given_name,
      },
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'birthdate',
        Value: birthdate,
      },
      {
        Name: 'address',
        Value: address,
      },
      // Add any additional attributes here
    ],
  };

  CognitoIdentityServiceProvider.signUp(signUpParams, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to sign up user' });
    } else {
      console.log(data);
      res.status(200).json({ message: 'User signed up successfully', data });
    }
  });
};
