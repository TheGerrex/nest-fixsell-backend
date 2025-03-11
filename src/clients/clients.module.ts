import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientPrintersModule } from './client-printers/client-printers.module';
import { ClientAccountsModule } from './client-accounts/client-accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    ClientPrintersModule,
    ClientAccountsModule,
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
