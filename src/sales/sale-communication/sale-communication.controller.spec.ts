import { Test, TestingModule } from '@nestjs/testing';
import { SaleCommunicationController } from './sale-communication.controller';
import { SaleCommunicationService } from './sale-communication.service';

describe('SaleCommunicationController', () => {
  let controller: SaleCommunicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleCommunicationController],
      providers: [SaleCommunicationService],
    }).compile();

    controller = module.get<SaleCommunicationController>(SaleCommunicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
