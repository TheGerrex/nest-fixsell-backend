import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOperationsLogisticsService } from './product-operations-logistics.service';
import { ProductOperationsLogisticsController } from './product-operations-logistics.controller';
import { ProductOperationsLogistic } from './entities/product-operations-logistic.entity';
import { Product } from '../product/entities/product.entity'; // Import the Product entity

@Module({
  imports: [TypeOrmModule.forFeature([ProductOperationsLogistic, Product])], // Include Product entity here
  providers: [ProductOperationsLogisticsService],
  controllers: [ProductOperationsLogisticsController],
  exports: [ProductOperationsLogisticsService],
})
export class ProductOperationsLogisticsModule {}
