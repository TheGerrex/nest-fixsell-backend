import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientShippingAddressesService } from './client-shipping-addresses.service';
import { ClientShippingAddressesController } from './client-shipping-addresses.controller';
import { ClientShippingAddress } from './entities/client-shipping-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientShippingAddress])],
  controllers: [ClientShippingAddressesController],
  providers: [ClientShippingAddressesService],
  exports: [ClientShippingAddressesService],
})
export class ClientShippingAddressesModule {}
