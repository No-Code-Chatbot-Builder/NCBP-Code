interface AddDomainRequest {
  workspaceId: string;
  botId: string;
  domain: string;
}

interface DeleteDomainRequest {
  workspaceId: string;
  botId: string;
  domain: string;
}

interface GetDomainsRequest {
  workspaceId: string;
  botId: string;
}

export { AddDomainRequest, DeleteDomainRequest, GetDomainsRequest };
