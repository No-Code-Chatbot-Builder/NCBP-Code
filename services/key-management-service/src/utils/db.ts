import * as AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: "us-east-1"
});

export { dynamoDB };