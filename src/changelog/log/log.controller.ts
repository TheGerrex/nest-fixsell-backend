import { Controller, Get, Param, Query } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  async getAllLogs(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    const limitNumber = parseInt(limit, 1000) || 1000;
    const offsetNumber = parseInt(offset, 10) || 0;
    return this.logService.getAllLogs(limitNumber, offsetNumber);
  }

  @Get(':id')
  async getLogById(@Param('id') id: string) {
    return this.logService.getLogById(Number(id));
  }
}
