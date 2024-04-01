import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './web-socket-gateway.service';

describe('WebSocketGatewayService', () => {
  let service: ChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    service = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
