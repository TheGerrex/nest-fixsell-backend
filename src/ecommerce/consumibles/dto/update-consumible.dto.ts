import { PartialType } from '@nestjs/mapped-types';
import { CreateConsumibleDto } from './create-consumible.dto';

export class UpdateConsumibleDto extends PartialType(CreateConsumibleDto) {}
