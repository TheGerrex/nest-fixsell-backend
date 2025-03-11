import { PartialType } from '@nestjs/mapped-types';
import { CreateClientPrinterDto } from './create-client-printer.dto';

export class UpdateClientPrinterDto extends PartialType(CreateClientPrinterDto) {}
