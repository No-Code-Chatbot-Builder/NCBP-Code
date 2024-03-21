import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { SimpleJwksCache } from 'aws-jwt-verify/jwk';
import { SimpleJsonFetcher } from 'aws-jwt-verify/https';
import * as AWS from 'aws-sdk';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private dynamodb: AWS.DynamoDB.DocumentClient;

  constructor() {
    this.dynamodb = new AWS.DynamoDB.DocumentClient({
      region: 'us-east-1'
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers as { authorization?: string };
    if (headers.authorization && headers.authorization.startsWith('Bearer')) {
      const token = headers.authorization.split(' ')[1];
      if (!token) {
        throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
      }
      // Verifier that expects valid access tokens:
      const verifier = CognitoJwtVerifier.create(
        {
          userPoolId: process.env.USER_POOL_ID,
          tokenUse: 'id', // or "id",
          clientId: process.env.CLIENT_ID
        },
        {
          jwksCache: new SimpleJwksCache({
            fetcher: new SimpleJsonFetcher({
              defaultRequestOptions: {
                responseTimeout: 6000
                // You can add additional request options:
                // For NodeJS: https://nodejs.org/api/http.html#httprequestoptions-callback
                // For Web (init object): https://developer.mozilla.org/en-US/docs/Web/API/fetch#syntax
              }
            })
          })
        }
      );

      try {
        const payload = await verifier.verify(token);
        //console.log(payload);

        //Define DynamoDB parameters
        const params = {
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Key: {
            PK: `USER#${payload.sub}`,
            SK: `USEREMAIL#${payload.email}`
          }
        };

        // Fetch User
        try {
          const data = await this.dynamodb.get(params).promise();
          req['user'] = data.Item;
        } catch {
          console.log('User not found!');
        }

        next(); // Call next route handler
      } catch (error: any) {
        console.log(error);
        console.log('Token not valid!');
      }
    }
  }
}