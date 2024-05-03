import express from 'express';
import { Request } from 'express';
import { AddDomainRequest, DeleteDomainRequest, GetDomainsRequest } from '../dtos/request.dto';
import { deleteDomainHandler } from '../services/delete-domain.service';
import { addDomainHandler } from '../services/add-domain.service';
import { getDomainHandler } from '../services/get-domain.service';
import { validateAddDomain, validateDeleteDomain } from '../middlewares/request-validation.middleware';

const keyRouter = express.Router();

keyRouter.use('/domains', (req: Request, res, next) => {
  next();
});

// POST create a new key (clientId, clientSecret)
keyRouter.post('/', validateAddDomain, async (req, res) => {
  const input: AddDomainRequest = req.body;

  const { statusCode, body } = await addDomainHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// DELETE revoke a key
keyRouter.delete('/', validateDeleteDomain, async (req, res) => {
  const input: DeleteDomainRequest = req.body;

  const { statusCode, body } = await deleteDomainHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

// GET list of keys
keyRouter.get('/', async (req, res) => {
  const input: GetDomainsRequest = {
    workspaceId: req.query.workspaceId as string,
    botId: req.query.botId as string,
  };

  const { statusCode, body } = await getDomainHandler(input);
  res.status(statusCode).json(JSON.parse(body));
});

export default keyRouter;
