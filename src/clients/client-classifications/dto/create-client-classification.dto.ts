import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateClientClassificationDto {
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

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
