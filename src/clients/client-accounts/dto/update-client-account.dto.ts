import { PartialType } from '@nestjs/mapped-types';
import { CreateClientAccountDto } from './create-client-account.dto';

export class UpdateClientAccountDto extends PartialType(CreateClientAccountDto) {}
