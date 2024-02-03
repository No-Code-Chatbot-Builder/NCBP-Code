import { Request, Response } from 'express';
import { CognitoIdentityServiceProvider, poolData } from '../../cognito';
import jwt from 'jsonwebtoken';

export const updateCustomerInfoHandler = (req: Request, res: Response) => {
  const { token, updatedInfo } = req.body;

  // Verify the token
  verifyToken(token)
    .then((decodedToken) => {
      const userId = decodedToken.sub; // Assuming sub is the user ID in the Cognito token

      // Update user information in Cognito
      const updateParams: AWS.CognitoIdentityServiceProvider.AdminUpdateUserAttributesRequest = {
        UserPoolId: poolData.UserPoolId,
        Username: userId,
        UserAttributes: getUpdatedAttributes(updatedInfo),
      };

      CognitoIdentityServiceProvider.adminUpdateUserAttributes(updateParams, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to update customer information' });
        } else {
          // Fetch the updated user information after the update
          const getUserParams: AWS.CognitoIdentityServiceProvider.AdminGetUserRequest = {
            UserPoolId: poolData.UserPoolId,
            Username: userId,
          };

          CognitoIdentityServiceProvider.adminGetUser(getUserParams, (err, userData) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Failed to fetch updated information' });
            } else {
              // Extract and return the updated user attributes
              const updatedUserAttributes = userData.UserAttributes.reduce((acc, attribute) => {
                acc[attribute.Name] = attribute.Value;
                return acc;
              }, {});

              res.status(200).json({
                message: 'Customer information updated successfully',
                updatedInfo: updatedUserAttributes,
              });
            }
          });
        }
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
    });
};

const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Replace 'your-secret-key' with your actual secret key used to sign JWT tokens
    const secretKey = 'your-secret-key';

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

const getUpdatedAttributes = (updatedInfo: any): AWS.CognitoIdentityServiceProvider.AttributeType[] => {
  // Map the updatedInfo object to AWS Cognito attributes
  const updatedAttributes: AWS.CognitoIdentityServiceProvider.AttributeType[] = [];

  // Example: Assume updatedInfo has properties like 'fullName', 'birthdate', 'address'
  if (updatedInfo.fullName) {
    updatedAttributes.push({
      Name: 'name',
      Value: updatedInfo.fullName,
    });
  }

  if (updatedInfo.birthdate) {
    updatedAttributes.push({
      Name: 'birthdate',
      Value: updatedInfo.birthdate,
    });
  }

  if (updatedInfo.address) {
    updatedAttributes.push({
      Name: 'address',
      Value: updatedInfo.address,
    });
  }

  // Add any additional attributes here based on your requirements

  return updatedAttributes;
};
