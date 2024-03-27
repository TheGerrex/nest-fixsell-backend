import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleCommunicationDto } from './create-sale-communication.dto';

export class UpdateSaleCommunicationDto extends PartialType(CreateSaleCommunicationDto) {}
