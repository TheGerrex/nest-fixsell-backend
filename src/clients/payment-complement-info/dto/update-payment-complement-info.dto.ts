import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentComplementInfoDto } from './create-payment-complement-info.dto';

export class UpdatePaymentComplementInfoDto extends PartialType(CreatePaymentComplementInfoDto) {}
