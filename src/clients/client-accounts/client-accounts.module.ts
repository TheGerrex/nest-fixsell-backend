import { Module } from '@nestjs/common';
import { ClientAccountsService } from './client-accounts.service';
import { ClientAccountsController } from './client-accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientAccount } from './entities/client-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientAccount])],
  controllers: [ClientAccountsController],
  providers: [ClientAccountsService],
  exports: [ClientAccountsService],
})
export class ClientAccountsModule {}
