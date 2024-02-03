import * as AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1', // e.g., us-east-1
});

export const CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export const poolData = {
  UserPoolId: 'us-east-1_W8UbOJVze',
  ClientId: '51b74ccn6l83arrqlu683bcatu',
};