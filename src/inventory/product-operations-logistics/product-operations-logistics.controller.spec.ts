import { Test, TestingModule } from '@nestjs/testing';
import { ProductOperationsLogisticsController } from './product-operations-logistics.controller';
import { ProductOperationsLogisticsService } from './product-operations-logistics.service';

describe('ProductOperationsLogisticsController', () => {
  let controller: ProductOperationsLogisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductOperationsLogisticsController],
      providers: [ProductOperationsLogisticsService],
    }).compile();

    controller = module.get<ProductOperationsLogisticsController>(
      ProductOperationsLogisticsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
