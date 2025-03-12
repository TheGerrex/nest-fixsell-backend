import { Test, TestingModule } from '@nestjs/testing';
import { ClientCommercialConditionsController } from './client-commercial-conditions.controller';
import { ClientCommercialConditionsService } from './client-commercial-conditions.service';

describe('ClientCommercialConditionsController', () => {
  let controller: ClientCommercialConditionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientCommercialConditionsController],
      providers: [ClientCommercialConditionsService],
    }).compile();

    controller = module.get<ClientCommercialConditionsController>(ClientCommercialConditionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
