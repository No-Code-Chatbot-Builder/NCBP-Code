import { Request, Response } from 'express';
import { CognitoIdentityServiceProvider, poolData } from '../../cognito';
import crypto from 'crypto';

export const updateUserHandler = (req: Request, res: Response) => {
  const { sub, newAttributes } = req.body;

  if (!sub || !newAttributes) {
    return res.status(400).json({ error: 'Subject (sub) and newAttributes are required.' });
  }

  const clientId = poolData.ClientId;
  const clientSecret = '1iho4rbr5g0l82bfe09rrkqopv2gla36d2qphsrmtn2sdl4l1ues'; // Replace with your actual client secret

  // You can create a new secret hash for the update operation if needed
  const secretHash = crypto.createHmac('SHA256', clientSecret)
    .update(sub + clientId)
    .digest('base64');

  const updateParams: AWS.CognitoIdentityServiceProvider.AdminUpdateUserAttributesRequest = {
    UserPoolId: poolData.UserPoolId,
    Username: sub, // Use the 'sub' as the username to identify the user
    UserAttributes: newAttributes,
  };

  CognitoIdentityServiceProvider.adminUpdateUserAttributes(updateParams, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update user attributes' });
    } else {
      console.log(data);
      res.status(200).json({ message: 'User attributes updated successfully', data });
    }
  });
};
