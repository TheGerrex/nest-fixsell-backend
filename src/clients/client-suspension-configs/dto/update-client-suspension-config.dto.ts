import { PartialType } from '@nestjs/mapped-types';
import { CreateClientSuspensionConfigDto } from './create-client-suspension-config.dto';

export class UpdateClientSuspensionConfigDto extends PartialType(CreateClientSuspensionConfigDto) {}
