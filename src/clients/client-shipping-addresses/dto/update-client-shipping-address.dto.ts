import { PartialType } from '@nestjs/mapped-types';
import { CreateClientShippingAddressDto } from './create-client-shipping-address.dto';

export class UpdateClientShippingAddressDto extends PartialType(CreateClientShippingAddressDto) {}
