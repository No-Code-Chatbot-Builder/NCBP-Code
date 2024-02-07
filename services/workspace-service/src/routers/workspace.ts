import express from 'express';
import {
  validateAddUserToWorkspace,
  validateCreateWorkspace,
  validateDeleteWorkspace,
  validateGetWorkspace,
  validateUpdateWorkspace,
} from '../middlewares/request-validation.middleware';
import {
  AddUserToWorkspaceRequest,
  CreateUserRequest,
  CreateWorkspaceRequest,
  DeleteWorkspaceRequest,
  GetWorkspaceRequest,
  RemoveUserFromWorkspaceRequest,
  RespondToWorkspaceInviteRequest,
  UpdateWorkspaceRequest,
} from '../interfaces/request.interface';
import { createWorkspaceHandler } from '../controller/create-workspace.controller';
import { getWorkspaceHandler } from '../controller/get-workspace.controller';
import { inviteUserHandler } from '../controller/invite-user.controller';
import { updateWorkspaceHandler } from '../controller/update-workspace.controller';
import { deleteWorkspaceHandler } from '../controller/delete-workspace.controller';
import { authorize } from '../middlewares/role-authorization.middleware';
import { createUserHandler } from '../controller/create-user.controller';
import { respondInviteHandler } from '../controller/respond-invite.controller';
import { removeUserHandler } from '../controller/remove-user.controller';

const workspaceRouter = express.Router();

workspaceRouter.use('/workspaces', (req, res, next) => {
  next();
});

// Test 
workspaceRouter.post("/test", async (req, res) => {
  const input: CreateUserRequest = req.body;

  const { statusCode, body } = await createUserHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// POST create a new workspace
workspaceRouter.post('/', validateCreateWorkspace, async (req, res) => {
  const input: CreateWorkspaceRequest = req.body;

  const { statusCode, body } = await createWorkspaceHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// POST invite a user to a workspace
workspaceRouter.post('/invite', authorize, validateAddUserToWorkspace, async (req, res) => {
  const input: AddUserToWorkspaceRequest = req.body;

  const { statusCode, body } = await inviteUserHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// POST respond to invite of a workspace
workspaceRouter.post('/respond', async (req, res) => {
  const input: RespondToWorkspaceInviteRequest = req.body;

  const { statusCode, body } = await respondInviteHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// POST remove user from a workspace
workspaceRouter.post('/remove', async (req, res) => {
  const input: RemoveUserFromWorkspaceRequest = req.body;

  const { statusCode, body } = await removeUserHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// PUT update a workspace
workspaceRouter.put('/', authorize, validateUpdateWorkspace, async (req, res) => {
  const input: UpdateWorkspaceRequest = req.body;

  const { statusCode, body } = await updateWorkspaceHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// DELETE a workspace
workspaceRouter.delete('/', authorize, validateDeleteWorkspace, async (req, res) => {
  const input: DeleteWorkspaceRequest = req.body;

  const { statusCode, body } = await deleteWorkspaceHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// GET a workspace
workspaceRouter.get('/:workspaceName', validateGetWorkspace, async (req, res) => {
  const input: GetWorkspaceRequest = {
    workspaceName: req.params.workspaceName as string,
  };

  const { statusCode, body } = await getWorkspaceHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

export default workspaceRouter;
