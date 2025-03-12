import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../entities/client.entity';
import { PaymentMethod } from '../../interfaces/payment-method.interface';
import { PaymentComplementInfo } from '../../payment-complement-info/entities/payment-complement-info.entity';

@Entity('client_accounts')
export class ClientAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column('uuid')
  clientId: string;

  @Column('text')
  accountName: string;

  @Column('text')
  accountNumber: string;

  @Column({ type: 'text', nullable: true })
  clabe: string;

  @Column({ type: 'text', nullable: true })
  bankName: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.ELECTRONIC_TRANSFER,
  })
  paymentMethod: PaymentMethod;

  @Column('boolean', { default: false })
  isDefault: boolean;

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

  @OneToMany(() => PaymentComplementInfo, (info) => info.clientAccount)
  paymentComplementInfo: PaymentComplementInfo[];
}
