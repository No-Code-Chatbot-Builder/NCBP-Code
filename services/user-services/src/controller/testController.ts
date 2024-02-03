// source/controllers/userController.ts
import { Request, Response } from 'express';

export const getAllUser = (req: Request, res: Response) => {
  console.log('Hello, World!');
  res.json({ message: 'Hello, World!' });
};
