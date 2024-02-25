import { Test, TestingModule } from '@nestjs/testing';
import { LangchainDocLoaderService } from './langchain-docLoaders.service';

describe('LangchainDocLoaderService', () => {
  let service: LangchainDocLoaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LangchainDocLoaderService],
    }).compile();

    service = module.get<LangchainDocLoaderService>(LangchainDocLoaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
