import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentComplementInfoService } from './payment-complement-info.service';
import { PaymentComplementInfoController } from './payment-complement-info.controller';
import { PaymentComplementInfo } from './entities/payment-complement-info.entity';
import { ClientAccount } from '../client-accounts/entities/client-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentComplementInfo, ClientAccount])],
  controllers: [PaymentComplementInfoController],
  providers: [PaymentComplementInfoService],
  exports: [PaymentComplementInfoService],
})
export class PaymentComplementInfoModule {}
