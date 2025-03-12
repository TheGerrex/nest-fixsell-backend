import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ClientCommercialConditionsService } from './client-commercial-conditions.service';
import { CreateClientCommercialConditionDto } from './dto/create-client-commercial-condition.dto';
import { UpdateClientCommercialConditionDto } from './dto/update-client-commercial-condition.dto';

@Controller('client-commercial-conditions')
export class ClientCommercialConditionsController {
  constructor(
    private readonly conditionsService: ClientCommercialConditionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateClientCommercialConditionDto) {
    return this.conditionsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.conditionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conditionsService.findOne(id);
  }

  @Get('client/:clientId')
  findByClientId(@Param('clientId') clientId: string) {
    return this.conditionsService.findByClientId(clientId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateClientCommercialConditionDto,
  ) {
    return this.conditionsService.update(id, updateDto);
  }

  @Patch('client/:clientId')
  updateByClientId(
    @Param('clientId') clientId: string,
    @Body() updateDto: UpdateClientCommercialConditionDto,
  ) {
    return this.conditionsService.updateByClientId(clientId, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conditionsService.remove(id);
  }
}
