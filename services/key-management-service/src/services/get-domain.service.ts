import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDB } from '../utils/db';
import { GetDomainsRequest } from '../dtos/request.dto';
import { Domain } from '../entities/domain';
import { getDomains } from '../data/getDomains';
import { DEFAULT_DOMAIN } from '../utils/constants';

export const getDomainHandler = async (input: GetDomainsRequest) => {
  const domain = new Domain({
    ...DEFAULT_DOMAIN,
    workspaceId: input.workspaceId,
    botId: input.botId,
  });

  const { error, statusCode, domain: resultDomain } = await getDomains(domain);

  const body = error ? JSON.stringify({ error }) : JSON.stringify({ resultDomain });

  return {
    statusCode,
    body,
  };
};
