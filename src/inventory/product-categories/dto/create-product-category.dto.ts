import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  category_name: string;

  @IsOptional()
  parent_category: number;

  @IsIn(['fifo', 'lifo', 'nearest', 'least packages'])
  withdrawal_strategy: 'fifo' | 'lifo' | 'nearest' | 'least packages';
}
