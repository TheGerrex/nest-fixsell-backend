import { Test, TestingModule } from '@nestjs/testing';
import { ConsumiblesService } from './consumibles.service';

describe('ConsumiblesService', () => {
  let service: ConsumiblesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumiblesService],
    }).compile();

    service = module.get<ConsumiblesService>(ConsumiblesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
