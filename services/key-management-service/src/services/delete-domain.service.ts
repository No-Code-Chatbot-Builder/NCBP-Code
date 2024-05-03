import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '../utils/db';
import { DeleteDomainRequest } from '../dtos/request.dto';
import { Domain } from '../entities/domain';
import { deleteDomain } from '../data/deleteDomain';

export const deleteDomainHandler = async (input: DeleteDomainRequest) => {
  const domain = new Domain({
    workspaceId: input.workspaceId,
    botId: input.botId,
    allowedDomains: [input.domain],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const { error, statusCode, domain: resultDomain } = await deleteDomain(domain);

  const body = error ? JSON.stringify({ error }) : JSON.stringify({ resultDomain });

  return {
    statusCode,
    body,
  };
};
