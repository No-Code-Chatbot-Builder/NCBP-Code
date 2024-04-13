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
} from '../dtos/request.dto';
import { createWorkspaceHandler } from '../services/create-workspace.controller';
import { getWorkspaceHandler } from '../services/get-workspace.controller';
import { inviteUserHandler } from '../services/invite-user.controller';
import { updateWorkspaceHandler } from '../services/update-workspace.controller';
import { deleteWorkspaceHandler } from '../services/delete-workspace.controller';
import { authorize } from '../middlewares/role-authorization.middleware';
import { createUserHandler } from '../services/create-user.controller';
import { respondInviteHandler } from '../services/respond-invite.controller';
import { removeUserHandler } from '../services/remove-user.controller';
import { listInvitesHandler } from '../services/list-invites.controller';

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
  const { user } = req;

  const { statusCode, body } = await createWorkspaceHandler(input, user);
  res.status(statusCode).json(JSON.parse(body));
});

// POST invite a user to a workspace
workspaceRouter.post('/invite', authorize, validateAddUserToWorkspace, async (req, res) => {
  const input: AddUserToWorkspaceRequest = req.body;

  const { statusCode, body } = await inviteUserHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// GET list of workspace invites
workspaceRouter.get('/invites', async (req, res) => {
  const { user } = req;

  const { statusCode, body } = await listInvitesHandler(user);
  res.status(statusCode).json(JSON.parse(body));
});

// POST respond to invite of a workspace
workspaceRouter.post('/respond', async (req, res) => {
  const input: RespondToWorkspaceInviteRequest = req.body;
  const { user } = req;

  const { statusCode, body } = await respondInviteHandler(input, user);
  res.status(statusCode).json(JSON.parse(body));
});

// PUT remove user from a workspace
workspaceRouter.put('/remove', async (req, res) => {
  const input: RemoveUserFromWorkspaceRequest = req.body;

  const { statusCode, body } = await removeUserHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// PUT update a workspace
workspaceRouter.put('/', authorize, validateUpdateWorkspace, async (req, res) => {
  const input: UpdateWorkspaceRequest = req.body;
  const { user } = req;

  const { statusCode, body } = await updateWorkspaceHandler(input, user);
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
