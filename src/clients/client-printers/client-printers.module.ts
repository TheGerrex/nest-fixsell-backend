import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientPrinter } from './entities/client-printer.entity';
import { ClientPrintersService } from './client-printers.service';
import { ClientPrintersController } from './client-printers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClientPrinter])],
  controllers: [ClientPrintersController],
  providers: [ClientPrintersService],
  exports: [ClientPrintersService],
})
export class ClientPrintersModule {}
