import { Module } from '@nestjs/common';
import { SoftwaresService } from './softwares.service';
import { SoftwaresController } from './softwares.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Software } from './entities/software.entity';

@Module({
  controllers: [SoftwaresController],
  providers: [SoftwaresService],
  imports: [TypeOrmModule.forFeature([Software])],
})
export class SoftwaresModule { }
