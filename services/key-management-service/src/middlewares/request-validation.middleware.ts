import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { HttpStatusCode } from '../utils/constants';

const validateCreateKey = (req: Request, res: Response, next: NextFunction) => {
  body('accessMode').notEmpty().isString();
  body('userId').notEmpty().isString();
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

const validateDeleteKey = (req: Request, res: Response, next: NextFunction) => {
  body('clientId').notEmpty().isString();
  body('userId').notEmpty().isString();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};


export { validateCreateKey, validateDeleteKey };
