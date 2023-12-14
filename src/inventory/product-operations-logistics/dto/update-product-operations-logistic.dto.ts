import { PartialType } from '@nestjs/mapped-types';
import { CreateProductOperationsLogisticDto } from './create-product-operations-logistic.dto';

export class UpdateProductOperationsLogisticDto extends PartialType(CreateProductOperationsLogisticDto) {}
