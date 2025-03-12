import { IsOptional, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateClientClassificationDto } from './create-client-classification.dto';

export class UpdateClientClassificationDto extends PartialType(
  CreateClientClassificationDto,
) {
  @IsUUID()
  @IsOptional()
  businessGroupId?: string;

  @IsUUID()
  @IsOptional()
  collectionZoneId?: string;

  @IsUUID()
  @IsOptional()
  clientCategoryId?: string;

  @IsUUID()
  @IsOptional()
  businessLineId?: string;

  @IsUUID()
  @IsOptional()
  branchOfficeId?: string;
}
