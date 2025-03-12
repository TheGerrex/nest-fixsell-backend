import { PartialType } from '@nestjs/mapped-types';
import { CreateClientCommercialConditionDto } from './create-client-commercial-condition.dto';

export class UpdateClientCommercialConditionDto extends PartialType(CreateClientCommercialConditionDto) {}
