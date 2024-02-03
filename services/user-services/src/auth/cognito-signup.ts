import { Request, Response } from 'express';
import { CognitoIdentityServiceProvider, poolData } from '../../cognito';

export const signUpHandler = (req: Request, res: Response) => {
  const { fullName, userName, password, email, birthdate, address } = req.body;
  
  console.log("full name:", fullName);
  console.log(userName);
  console.log(password);
  console.log(email);
  console.log(birthdate);
  console.log(address);

  const signUpParams: AWS.CognitoIdentityServiceProvider.SignUpRequest = {
    ClientId: poolData.ClientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: 'name',
        Value: fullName,
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
