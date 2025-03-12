import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../entities/client.entity';

@Entity('client_contacts')
export class ClientContact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.contacts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column('uuid')
  clientId: string;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  officePhone: string;

  @Column('text', { nullable: true })
  homePhone: string;

  @Column('text', { nullable: true })
  mobilePhone: string;

  @Column('text', { nullable: true })
  email: string;

  @Column('text', { nullable: true })
  contactType: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  billingBranch: string;

  @Column('date', { nullable: true })
  birthday: Date;

  @Column('text', { nullable: true })
  observations: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  isDefault: boolean;

  @Column('boolean', { default: false })
  isBillingContact: boolean;

  @Column('boolean', { default: false })
  isPaymentComplementContact: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
