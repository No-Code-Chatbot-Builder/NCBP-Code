import { IDomain } from '../dtos/domain.dto';

class Domain implements IDomain {
  workspaceId: string;
  botId: string;
  allowedDomains: string[];
  createdAt: string;
  updatedAt: string;

  constructor({ workspaceId, botId, allowedDomains, createdAt, updatedAt }: IDomain) {
    this.workspaceId = workspaceId;
    this.botId = botId;
    this.allowedDomains = allowedDomains;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  key() {
    return {
      PK: `WORKSPACE#${this.workspaceId}`,
      SK: `DOMAIN#BOT#${this.botId}`,
    };
  }

  toItem() {
    return {
      ...this.key(),
      allowedDomains: this.allowedDomains,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      type: 'domain',
    };
  }

  static fromItem(item: IDomain) {
    return new Domain({
      workspaceId: item.workspaceId,
      botId: item.botId,
      allowedDomains: item.allowedDomains,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  }
}

export { Domain };
