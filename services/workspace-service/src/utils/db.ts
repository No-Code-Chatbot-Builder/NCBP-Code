import * as AWS from 'aws-sdk';

// set profile - local testing
AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'ncbp' });

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1"
});

export { dynamoDB };
