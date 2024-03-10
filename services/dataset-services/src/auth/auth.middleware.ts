import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { DynamoDB } from 'aws-sdk';
import { NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly dynamoDb: DynamoDB.DocumentClient;
  private configService: ConfigService;

  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient();
  }

  async use(req: Request, res: Response, next: NextFunction) {
    //let headers = new Headers();
    // const headers = req.headers as { authorization?: string }
    // if (headers.authorization && headers.authorization.startsWith('Bearer'))
    // {
    //   const token = headers.authorization.split(' ')[1];
    //   if (!token) {
    //     throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    //   }
    //   const secret = process.env.JWT_SECRET;
    //   // Verify token
    //   const decoded = jwt.verify(token, secret)
      next(); // Call next route handler
    // }
    
    // try {
    //   const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    //   if (!decoded.sub) {
    //     throw new HttpException('Invalid token: sub not found', HttpStatus.UNAUTHORIZED);
    //   }

    //   // Define DynamoDB parameters
    //   const params: DynamoDB.DocumentClient.GetItemInput = {
    //     TableName: this.configService.get<string>('DYNAMODB_TABLE_NAME'),
    //     Key: {
    //       'sub': decoded.sub,
    //     },
    //   };

    //   // Fetch user details from DynamoDB table
    //   const data = await this.dynamoDb.get(params).promise();

    //   if (!data) {
    //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    //   }

    // } catch (error) {
    //   console.error(error);
    //   throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    // }
  }
}
