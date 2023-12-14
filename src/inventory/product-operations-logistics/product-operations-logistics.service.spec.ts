import { Test, TestingModule } from '@nestjs/testing';
import { ProductOperationsLogisticsService } from './product-operations-logistics.service';

describe('ProductOperationsLogisticsService', () => {
  let service: ProductOperationsLogisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductOperationsLogisticsService],
    }).compile();

    service = module.get<ProductOperationsLogisticsService>(ProductOperationsLogisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
