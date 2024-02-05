import * as AWS from 'aws-sdk';

AWS.config.update({
  region: 'us-east-1', // e.g., us-east-1
});

export const CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

export const poolData = {
  UserPoolId: 'us-east-1_meGLNeg9U',
  ClientId: '5p1eg9par17nb5bncfboerni8b',
};