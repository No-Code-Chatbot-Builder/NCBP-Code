import { Test, TestingModule } from '@nestjs/testing';
import { GenerateIdService } from './generate-id.service';

describe('GenerateIdService', () => {
  let service: GenerateIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenerateIdService],
    }).compile();

    service = module.get<GenerateIdService>(GenerateIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
