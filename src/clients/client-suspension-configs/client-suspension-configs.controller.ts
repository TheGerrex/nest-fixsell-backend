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
import { ClientSuspensionConfigsService } from './client-suspension-configs.service';
import { CreateClientSuspensionConfigDto } from './dto/create-client-suspension-config.dto';
import { UpdateClientSuspensionConfigDto } from './dto/update-client-suspension-config.dto';

@Controller('client-suspension-configs')
export class ClientSuspensionConfigsController {
  constructor(
    private readonly configsService: ClientSuspensionConfigsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createConfigDto: CreateClientSuspensionConfigDto) {
    return this.configsService.create(createConfigDto);
  }

  @Get()
  findAll() {
    return this.configsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configsService.findOne(id);
  }

  @Get('client/:clientId')
  findByClientId(@Param('clientId') clientId: string) {
    return this.configsService.findByClientId(clientId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConfigDto: UpdateClientSuspensionConfigDto,
  ) {
    return this.configsService.update(id, updateConfigDto);
  }

  @Patch('client/:clientId')
  updateByClientId(
    @Param('clientId') clientId: string,
    @Body() updateConfigDto: UpdateClientSuspensionConfigDto,
  ) {
    return this.configsService.updateByClientId(clientId, updateConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configsService.remove(id);
  }
}
