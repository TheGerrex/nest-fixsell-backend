import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOperationsLogisticsService } from './product-operations-logistics.service';
import { ProductOperationsLogisticsController } from './product-operations-logistics.controller';
import { ProductOperationsLogistic } from './entities/product-operations-logistic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOperationsLogistic])],
  providers: [ProductOperationsLogisticsService],
  controllers: [ProductOperationsLogisticsController],
  exports: [ProductOperationsLogisticsService],
})
export class ProductOperationsLogisticsModule {}
