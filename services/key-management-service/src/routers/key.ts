import express from 'express';
import { validateCreateKey, validateDeleteKey } from '../middlewares/request-validation.middleware';
import { CreateKeyRequest, DeleteKeyRequest, GetKeysRequest } from '../dtos/request.dto';
import { Request } from 'express';
import { createKeyHandler } from '../services/create-key.service';
import { deleteKeyHandler } from '../services/delete-key.service';
import { getKeysHandler } from '../services/get-keys.service';

const keyRouter = express.Router();

keyRouter.use('/keys', (req: Request, res, next) => {
    next();
});

// POST create a new key (clientId, clientSecret)
keyRouter.post('/', validateCreateKey, async (req, res) => {
  const input: CreateKeyRequest = req.body;

  const { statusCode, body } = await createKeyHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// DELETE revoke a key
keyRouter.delete('/:clientId', validateDeleteKey, async (req, res) => {
  const input: DeleteKeyRequest = req.body;

  const { statusCode, body } = await deleteKeyHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// GET list of keys
keyRouter.get('/', async (req, res) => {
    const input: GetKeysRequest = {
        userId: req.user.userId
    };

  const { statusCode, body } = await getKeysHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

export default keyRouter;