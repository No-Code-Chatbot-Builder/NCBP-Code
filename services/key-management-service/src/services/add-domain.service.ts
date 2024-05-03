import { addDomain } from '../data/addDomain';
import { AddDomainRequest } from '../dtos/request.dto';
import { Domain } from '../entities/domain';

export const addDomainHandler = async (input: AddDomainRequest) => {
  const domain = new Domain({
    workspaceId: input.workspaceId,
    botId: input.botId,
    allowedDomains: [input.domain],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const { error, statusCode, domain: resultDomain } = await addDomain(domain);

  const body = error ? JSON.stringify({ error }) : JSON.stringify({ resultDomain });

  return {
    statusCode,
    body,
  };
};
