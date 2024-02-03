import { Request, Response } from 'express';
import { CognitoIdentityServiceProvider, poolData } from '../../cognito';
import { authenticateToken } from '../../middleware'; // Import your authentication middleware

export const getUserHandler = (req: Request, res: Response) => {
  // Extract the user details from the request or token, depending on your implementation
  const userId = req.userId; // Assuming you have userId in the request after authentication

  // Fetch user details from Cognito using the userId
  const getUserParams: AWS.CognitoIdentityServiceProvider.AdminGetUserRequest = {
    UserPoolId: poolData.UserPoolId,
    Username: userId, // Use the user ID obtained from the authentication process
  };

  CognitoIdentityServiceProvider.adminGetUser(getUserParams, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to get user details' });
    } else {
      console.log(data);
      const userAttributes = data.UserAttributes.reduce((acc, attribute) => {
        acc[attribute.Name] = attribute.Value;
        return acc;
      }, {});

      // Return the user details in the desired format
      res.status(200).json({
        status: 'success',
        message: 'User details retrieved successfully',
        data: {
          user: userAttributes,
        },
      });
    }
  });
};

// Middleware for authentication
export const authenticateToken = (req: Request, res: Response, next: Function) => {
  // Get the token from the request headers or body, depending on your implementation
  const token = req.headers.authorization || req.body.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  // Validate the token and extract user ID
  // Implement your token validation logic here, e.g., using JWT or other authentication mechanisms
  const userId = validateTokenAndGetUserId(token);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  req.userId = userId;
  next();
};
