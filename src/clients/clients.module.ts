import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientPrintersModule } from './client-printers/client-printers.module';
import { ClientAccountsModule } from './client-accounts/client-accounts.module';
import { ClientContactsModule } from './client-contacts/client-contacts.module';
import { ClientShippingAddressesModule } from './client-shipping-addresses/client-shipping-addresses.module';
import { ClientBillingAddressesModule } from './client-billing-addresses/client-billing-addresses.module';
import { PaymentComplementInfoModule } from './payment-complement-info/payment-complement-info.module';
import { ClientSuspensionConfigsModule } from './client-suspension-configs/client-suspension-configs.module';
import { ClientCommercialConditionsModule } from './client-commercial-conditions/client-commercial-conditions.module';
import { ClientClassificationsModule } from './client-classifications/client-classifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    ClientPrintersModule,
    ClientAccountsModule,
    ClientContactsModule,
    ClientShippingAddressesModule,
    ClientBillingAddressesModule,
    PaymentComplementInfoModule,
    ClientSuspensionConfigsModule,
    ClientCommercialConditionsModule,
    ClientClassificationsModule,
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
