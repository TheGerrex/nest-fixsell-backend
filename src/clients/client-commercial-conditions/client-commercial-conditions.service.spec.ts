import { Test, TestingModule } from '@nestjs/testing';
import { ClientCommercialConditionsService } from './client-commercial-conditions.service';

describe('ClientCommercialConditionsService', () => {
  let service: ClientCommercialConditionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientCommercialConditionsService],
    }).compile();

    service = module.get<ClientCommercialConditionsService>(ClientCommercialConditionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
