import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientAccount } from '../../client-accounts/entities/client-account.entity';

@Entity('payment_complement_info')
export class PaymentComplementInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ClientAccount, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientAccountId' })
  clientAccount: ClientAccount;

  @Column('uuid')
  clientAccountId: string;

  // RFC ordenante - Sender's tax ID
  @Column('text')
  senderTaxId: string;

  // Banco ordenante - Sender's bank
  @Column('text')
  senderBank: string;

  // cuenta ordenante - Sender's account number
  @Column('text')
  senderAccountNumber: string;

  // RFC Destino - Recipient's tax ID
  @Column('text')
  recipientTaxId: string;

  // Cuenta beneficiario - Recipient's account number
  @Column('text')
  recipientAccountNumber: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
