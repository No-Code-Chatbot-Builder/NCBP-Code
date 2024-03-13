import { Injectable } from '@nestjs/common';// NestMiddleware, HttpException, HttpStatus } 
import { Request, Response, NextFunction } from 'express';
// import * as jwt from 'jsonwebtoken';
// import { DynamoDB } from 'aws-sdk';

@Injectable()
export class Middleware{ //implements NestMiddleware {
  
  async use(req: Request, res: Response, next: NextFunction) {
    next(); // Call next route handler
  }
  // private readonly dynamoDb: DynamoDB.DocumentClient;

  // constructor() {
  //   this.dynamoDb = new DynamoDB.DocumentClient();
  // }

  // async use(req: Request, res: Response, next: NextFunction) {
  //   const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization 

  //   if (!token) {
  //     throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
  //   }

  //   try {
  //     const decoded: any = jwt.verify(token, process.env.JWT_SECRET); 
  //     if (!decoded.sub) {
  //       throw new HttpException('Invalid token: sub not found', HttpStatus.UNAUTHORIZED);
  //     }

  //     // Define DynamoDB parameters
  //     const params: DynamoDB.DocumentClient.GetItemInput = {
  //       TableName: 'ncbp', 
  //       Key: {
  //         'sub': decoded.sub,
  //       },
  //     };

  //     // Fetch user details from DynamoDB table
  //     const data = await this.dynamoDb.get(params).promise();

  //     if (!data) {
  //       throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //     }


      
  //     next(); // Call next route handler
  //   } catch (error) {
  //     console.error(error);
  //     throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
  //   }
  // }

}
