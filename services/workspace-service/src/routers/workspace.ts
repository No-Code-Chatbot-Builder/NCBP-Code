import express from 'express';
import { validateCreateWorkspace } from '../middlewares/request-validation.middleware';
import { CreateWorkspaceRequest, GetWorkspaceRequest } from '../interfaces/request.interface';
import { createWorkspaceHandler } from '../controller/create-workspace.controller';
import { getWorkspaceHandler } from '../controller/get-workspace.controller';

const workspaceRouter = express.Router();

workspaceRouter.use('/workspaces', (req, res, next) => {
  next();
});

workspaceRouter.post('/', validateCreateWorkspace, async (req, res) => {
  const input: CreateWorkspaceRequest = req.body;

  const { statusCode, body } = await createWorkspaceHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

workspaceRouter.get('/', async (req, res) => {
  const input: GetWorkspaceRequest = {
    userId: req.query.userId as string,
    workspaceName: req.query.workspaceName as string,
  };

  const { statusCode, body } = await getWorkspaceHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});



export default workspaceRouter;
