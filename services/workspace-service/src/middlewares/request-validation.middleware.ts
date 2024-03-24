import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { HttpStatusCode } from '../utils/constants';

const validateCreateWorkspace = (req: Request, res: Response, next: NextFunction) => {
  body('name').notEmpty().isString();
  body('website').optional().isString();
  body('description').optional().isString();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

const validateGetWorkspace = (req: Request, res: Response, next: NextFunction) => {
  query('workspaceName').notEmpty().isString();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

const validateAddUserToWorkspace = (req: Request, res: Response, next: NextFunction) => {
  body('userId').notEmpty().isString();
  body('workspaceName').notEmpty().isString();
  body('userEmail').notEmpty().isEmail();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

const validateRemoveUserFromWorkspace = (req: Request, res: Response, next: NextFunction) => {
  body('userId').notEmpty().isString();
  body('workspaceName').notEmpty().isString();
  body('userEmail').notEmpty().isEmail();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

const validateUpdateWorkspace = (req: Request, res: Response, next: NextFunction) => {
  body('members').notEmpty().isNumeric();
  body('createdAt').notEmpty().isString();
  body('workspaceName').notEmpty().isString();
  body('website').optional().isString();
  body('description').optional().isString();

  if (!req.body.website && !req.body.description) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: 'Either website or description should be present' });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

const validateDeleteWorkspace = (req: Request, res: Response, next: NextFunction) => {
  body('workspaceName').notEmpty().isString();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

export {
  validateCreateWorkspace,
  validateGetWorkspace,
  validateAddUserToWorkspace,
  validateRemoveUserFromWorkspace,
  validateUpdateWorkspace,
  validateDeleteWorkspace,
};
