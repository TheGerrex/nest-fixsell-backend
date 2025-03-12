import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientBillingAddressesService } from './client-billing-addresses.service';
import { ClientBillingAddressesController } from './client-billing-addresses.controller';
import { ClientBillingAddress } from './entities/client-billing-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientBillingAddress])],
  controllers: [ClientBillingAddressesController],
  providers: [ClientBillingAddressesService],
  exports: [ClientBillingAddressesService],
})
export class ClientBillingAddressesModule {}
