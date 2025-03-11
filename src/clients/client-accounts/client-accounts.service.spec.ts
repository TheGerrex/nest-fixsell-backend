import { Test, TestingModule } from '@nestjs/testing';
import { ClientAccountsService } from './client-accounts.service';

describe('ClientAccountsService', () => {
  let service: ClientAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientAccountsService],
    }).compile();

    service = module.get<ClientAccountsService>(ClientAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
