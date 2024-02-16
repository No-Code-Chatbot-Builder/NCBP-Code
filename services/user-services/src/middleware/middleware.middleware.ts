import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { DynamoDB } from 'aws-sdk'; // Import DynamoDB from AWS SDK

@Injectable()
export class Middleware implements NestMiddleware {
  private readonly dynamoDb: DynamoDB.DocumentClient;

  constructor() {
    // Initialize DynamoDB Document Client
    this.dynamoDb = new DynamoDB.DocumentClient();
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET); // Verify token
      
      if (decoded.sub) {
        // Define DynamoDB parameters
        const params: DynamoDB.DocumentClient.GetItemInput = {
          TableName: 'demoTable', // Replace with your table name
          Key: {
            'sub': decoded.sub, // Key to search for in the table
          },
        };

        // Fetch user details from DynamoDB table
        this.dynamoDb.get(params, (err, data) => {
          if (err) {
            console.error("Unable to read item. Error:", JSON.stringify(err, null, 2));
            return res.status(500).json({ message: 'Error fetching user details' });
          } else {
            if (data.Item) {
              //req.user = data.Item; // Store user details in the request object
              next(); // Call next middleware or route handler
            } else {
              return res.status(404).json({ message: 'User not found' });
            }
          }
        });
      } else {
        return res.status(401).json({ message: 'Invalid token: sub not found' });
      }
    } catch (error) {
      // Handle token verification errors
      console.error(error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
}
