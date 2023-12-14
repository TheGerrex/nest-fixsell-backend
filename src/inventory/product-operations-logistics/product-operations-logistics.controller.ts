import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductOperationsLogisticsService } from './product-operations-logistics.service';
import { CreateProductOperationsLogisticDto } from './dto/create-product-operations-logistic.dto';
import { UpdateProductOperationsLogisticDto } from './dto/update-product-operations-logistic.dto';

@Controller('product-operations-logistics')
export class ProductOperationsLogisticsController {
  constructor(private readonly productOperationsLogisticsService: ProductOperationsLogisticsService) {}

  @Post()
  create(@Body() createProductOperationsLogisticDto: CreateProductOperationsLogisticDto) {
    return this.productOperationsLogisticsService.create(createProductOperationsLogisticDto);
  }

  @Get()
  findAll() {
    return this.productOperationsLogisticsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productOperationsLogisticsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductOperationsLogisticDto: UpdateProductOperationsLogisticDto) {
    return this.productOperationsLogisticsService.update(+id, updateProductOperationsLogisticDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productOperationsLogisticsService.remove(+id);
  }
}
