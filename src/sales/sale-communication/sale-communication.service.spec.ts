import { Test, TestingModule } from '@nestjs/testing';
import { SaleCommunicationService } from './sale-communication.service';

describe('SaleCommunicationService', () => {
  let service: SaleCommunicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaleCommunicationService],
    }).compile();

    service = module.get<SaleCommunicationService>(SaleCommunicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
