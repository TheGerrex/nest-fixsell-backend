import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PrintersModule } from 'src/printers/printers.module';
import { Printer } from 'src/printers/entities/printer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    TypeOrmModule.forFeature([Printer]), // Import TypeOrmModule and specify entities
  ],
})
export class SeedModule {}
