import { Module } from '@nestjs/common';
import { ClientContactsService } from './client-contacts.service';
import { ClientContactsController } from './client-contacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientContact } from './entities/client-contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientContact])],
  controllers: [ClientContactsController],
  providers: [ClientContactsService],
  exports: [ClientContactsService],
})
export class ClientContactsModule {}
