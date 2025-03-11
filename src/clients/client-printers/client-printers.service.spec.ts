import { Test, TestingModule } from '@nestjs/testing';
import { ClientPrintersService } from './client-printers.service';

describe('ClientPrintersService', () => {
  let service: ClientPrintersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientPrintersService],
    }).compile();

    service = module.get<ClientPrintersService>(ClientPrintersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
