import { Test, TestingModule } from '@nestjs/testing';
import { ClientAccountsController } from './client-accounts.controller';
import { ClientAccountsService } from './client-accounts.service';

describe('ClientAccountsController', () => {
  let controller: ClientAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientAccountsController],
      providers: [ClientAccountsService],
    }).compile();

    controller = module.get<ClientAccountsController>(ClientAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
