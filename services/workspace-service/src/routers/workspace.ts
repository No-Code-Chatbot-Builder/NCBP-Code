import express from 'express';
import { validateCreateWorkspace } from '../middlewares/request-validation.middleware';
import { CreateWorkspaceRequest } from '../interfaces/request.interface';
import { createWorkspace, isWorkspaceNameUnique } from '../controller/workspaceController';

const workspaceRouter  = express.Router();

workspaceRouter.use("/workspace", (req, res, next) => {
    next()
})

// missing authentication middleware
workspaceRouter.post('/create', validateCreateWorkspace, async (req, res) => {
    const input: CreateWorkspaceRequest = req.body;

  try {
    const isUnique = await isWorkspaceNameUnique(input.name);

    if (!isUnique) {
      return res.status(400).json({ error: 'Workspace name must be unique.' });
    }

    // Create the workspace
    await createWorkspace(input);

    res.status(200).json({ message: `Workspace for ${input.ownerId} created successfully.`});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default workspaceRouter;
