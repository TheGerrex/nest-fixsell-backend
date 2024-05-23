import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  executeSeed() {
    return this.seedService.executeSeed();
  }

  @Get('users')
  executeUserSeed() {
    return this.seedService.executeUserSeed();
  }

  @Get('roles')
  executeRoleSeed() {
    return this.seedService.executeRoleSeed();
  }
}
