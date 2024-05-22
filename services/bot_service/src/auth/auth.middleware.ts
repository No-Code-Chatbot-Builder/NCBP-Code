import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { SimpleJwksCache } from 'aws-jwt-verify/jwk';
import { SimpleJsonFetcher } from 'aws-jwt-verify/https';
import * as AWS from 'aws-sdk';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

// Extend Request to include custom query parameters
interface CustomRequest extends Request {
  query: {
    botId: string;
    workspaceId: string;
  };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private dynamodb: AWS.DynamoDB.DocumentClient;

  constructor(private httpService: HttpService) {
    this.dynamodb = new AWS.DynamoDB.DocumentClient({
      region: 'us-east-1',
    });
  }

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    console.log('middleware');
    //Extract botId and workspaceId from request
    const { botId, workspaceId } = req.query;

    // Fetch domains
    try {
        const domainResponse: AxiosResponse = await this.httpService.get('http://key-management-service.services/domains/', {
            params: { botId, workspaceId }
        }).toPromise();

        const domains = domainResponse.data.resultDomain.domains; // Assuming domains are in this path
        const requestOrigin = req.headers['origin'] as string | undefined; // Define requestOrigin here

        // Check if origin is in allowed domains
        if (domains.includes(requestOrigin)) {
            next(); // If origin matches, proceed without token verification
            return;
        }
    } catch (error) {
        console.error('Error fetching domains:', error);
        throw new HttpException('Failed to fetch domains', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Continue with the token verification process only if origin doesn't match
    const headers = req.headers as { authorization?: string }; // Define headers here
    if (headers.authorization && headers.authorization.startsWith('Bearer')) {
      const token = headers.authorization.split(' ')[1]; // Exract token here
      if (!token) {
        throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
      }

      // Verifier that expects valid access tokens:
      const verifier = CognitoJwtVerifier.create(
        {
          userPoolId: process.env.USER_POOL_ID,
          tokenUse: 'id', // or "id",
          clientId: process.env.CLIENT_ID,
        },
        {
          jwksCache: new SimpleJwksCache({
            fetcher: new SimpleJsonFetcher({
              defaultRequestOptions: {
                responseTimeout: 6000,
                // You can add additional request options:
                // For NodeJS: https://nodejs.org/api/http.html#httprequestoptions-callback
                // For Web (init object): https://developer.mozilla.org/en-US/docs/Web/API/fetch#syntax
              },
            }),
          }),
        },
      );
      console.log('above payload');
      try {
        const payload = await verifier.verify(token);
        //console.log(payload);

        //Define DynamoDB parameters
        const params = {
          TableName: process.env.DYNAMODB_TABLE_NAME,
          Key: {
            PK: `USER#${payload.sub}`,
            SK: `USEREMAIL#${payload.email}`,
          },
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
