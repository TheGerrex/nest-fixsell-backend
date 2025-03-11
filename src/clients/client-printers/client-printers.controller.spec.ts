import { Test, TestingModule } from '@nestjs/testing';
import { ClientPrintersController } from './client-printers.controller';
import { ClientPrintersService } from './client-printers.service';

describe('ClientPrintersController', () => {
  let controller: ClientPrintersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientPrintersController],
      providers: [ClientPrintersService],
    }).compile();

    controller = module.get<ClientPrintersController>(ClientPrintersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
