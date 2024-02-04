import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateCreateWorkspace = (req: Request, res: Response, next: NextFunction) => {
  body('name').notEmpty().isString();
  body('ownerId').notEmpty().isString();
  body('ownerEmail').notEmpty().isEmail();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
