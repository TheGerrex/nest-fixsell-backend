import { Module } from '@nestjs/common';
import { ProductOperationsLogisticsService } from './product-operations-logistics.service';
import { ProductOperationsLogisticsController } from './product-operations-logistics.controller';

@Module({
  controllers: [ProductOperationsLogisticsController],
  providers: [ProductOperationsLogisticsService]
})
export class ProductOperationsLogisticsModule {}
