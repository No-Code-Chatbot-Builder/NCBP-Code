import { Request, Response } from 'express';

export const createUser = (req: Request, res: Response) => {
  console.log('Create User');
  res.json({ message: 'Create User'});
};


export const getUser = (req: Request, res: Response) => {
  console.log('Get User');
  res.json({ message: 'Get User' });
};


export const updateUser = (req: Request, res: Response) => {
  console.log('Update User');
  res.json({ message: 'Update User' });
};