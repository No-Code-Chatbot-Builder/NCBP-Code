import { Test, TestingModule } from '@nestjs/testing';
import { BotServiceService } from './bot_service.service';

describe('BotServiceService', () => {
  let service: BotServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotServiceService],
    }).compile();

    service = module.get<BotServiceService>(BotServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
