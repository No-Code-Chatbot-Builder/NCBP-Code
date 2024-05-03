import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import { HttpStatusCode } from '../utils/constants';

const validateAddDomain = (req: Request, res: Response, next: NextFunction) => {
  body('workspaceId').notEmpty().isString();
  body('botId').notEmpty().isString();
  body('domain').notEmpty().isString();
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

const validateDeleteDomain = (req: Request, res: Response, next: NextFunction) => {
  body('workspaceId').notEmpty().isString();
  body('botId').notEmpty().isString();
  body('domain').notEmpty().isString();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

// const validateGetDomain = (req: Request, res: Response, next: NextFunction) => {
//   // validate query paramas
//   query('workspaceId').notEmpty().isString();
//   query('botId').notEmpty().isString();

//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
//   }
// };

export { validateAddDomain, validateDeleteDomain };
