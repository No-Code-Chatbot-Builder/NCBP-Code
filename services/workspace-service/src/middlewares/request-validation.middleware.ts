import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';

const VALIDATION_STATUS_CODE = 400;

const validateCreateWorkspace = (req: Request, res: Response, next: NextFunction) => {
  body('name').notEmpty().isString();
  body('ownerId').notEmpty().isString();
  body('ownerEmail').notEmpty().isEmail();
  body('website').optional().isString();
  body('description').optional().isString();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(VALIDATION_STATUS_CODE).json({ errors: errors.array() });
  }
  next();
};

const validateGetWorkspace = (req: Request, res: Response, next: NextFunction) => {
  query('userId').notEmpty().isString();
  query('workspaceName').notEmpty().isString();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(VALIDATION_STATUS_CODE).json({ errors: errors.array() });
  }
  next();
};

const validateAddUserToWorkspace = (req: Request, res: Response, next: NextFunction) => {
  body('userId').notEmpty().isString();
  body('workspaceName').notEmpty().isString();
  body('userEmail').notEmpty().isEmail();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(VALIDATION_STATUS_CODE).json({ errors: errors.array() });
  }
  next();
};

const validateRemoveUserFromWorkspace = (req: Request, res: Response, next: NextFunction) => {
  body('userId').notEmpty().isString();
  body('workspaceName').notEmpty().isString();
  body('userEmail').notEmpty().isEmail();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(VALIDATION_STATUS_CODE).json({ errors: errors.array() });
  }
  next();
};

const validateUpdateWorkspace = (req: Request, res: Response, next: NextFunction) => {
  body('userId').notEmpty().isString();
  body('members').notEmpty().isNumeric();
  body('createdAt').notEmpty().isString();
  body("userEmail").notEmpty().isEmail();
  body('workspaceName').notEmpty().isString();
  body('website').optional().isString();
  body('description').optional().isString();

  if (!req.body.website && !req.body.description) {
    return res.status(VALIDATION_STATUS_CODE).json({ errors: 'Either website or description should be present' });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(VALIDATION_STATUS_CODE).json({ errors: errors.array() });
  }
  next();
};

const validateDeleteWorkspace = (req: Request, res: Response, next: NextFunction) => {
  body('userId').notEmpty().isString();
  body('workspaceName').notEmpty().isString();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(VALIDATION_STATUS_CODE).json({ errors: errors.array() });
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
