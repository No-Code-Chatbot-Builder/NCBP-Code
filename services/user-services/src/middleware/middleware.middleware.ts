import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

// Extend the existing Request interface to include a `sub` property
declare global {
  namespace Express {
    interface Request {
      sub?: string; // Define the `sub` property
    }
  }
}

