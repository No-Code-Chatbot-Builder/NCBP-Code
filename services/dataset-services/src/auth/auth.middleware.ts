import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { DynamoDB } from 'aws-sdk';
import { NextFunction } from 'express';
import { CognitoJwtVerifier } from "aws-jwt-verify";


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly dynamoDb: DynamoDB.DocumentClient;
  
  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient();
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const headers = req.headers as { authorization?: string }
    if (headers.authorization && headers.authorization.startsWith('Bearer'))
    {
      const token = headers.authorization.split(' ')[1];
      if (!token) {
        throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
      }
      // Verify token
      const decoded = jwt.decode(token)
      // Verifier that expects valid access tokens:
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.USER_POOL_ID,
      tokenUse: "id",
      clientId: process.env.CLIENT_ID,
    });

    try {
      const payload = await verifier.verify(
        token
      );
      console.log(payload)
      next(); // Call next route handler
    } catch {
      console.log("Token not valid!");
    }
    
     
    }
  }
}
/*
if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        throw new Error('Token expired');
      }
      //Define DynamoDB parameters
      const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: {
          'PK': `USER#${payload.sub}`,
          'SK': `USEREMAIL#${payload.email}`,
        },
      };

      // Fetch User
      try {
        const data = await this.dynamoDb.get(params).promise();
        
      }
      catch{
        console.log("User not found!");
      }
      
*/