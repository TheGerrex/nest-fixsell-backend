import { PartialType } from '@nestjs/mapped-types';
import { CreateClientBillingAddressDto } from './create-client-billing-address.dto';

export class UpdateClientBillingAddressDto extends PartialType(CreateClientBillingAddressDto) {}
