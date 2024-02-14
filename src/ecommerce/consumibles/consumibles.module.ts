import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumible } from './entities/consumible.entity';
import { ConsumiblesService } from './consumibles.service';
import { ConsumiblesController } from './consumibles.controller';
import { PrintersModule } from '../../printers/printers.module';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Consumible]), PrintersModule],
  controllers: [ConsumiblesController],
  providers: [ConsumiblesService, FileUploadService],
})
export class ConsumiblesModule {}
