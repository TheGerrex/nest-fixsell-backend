import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../entities/client.entity';

@Entity('client_billing_addresses')
export class ClientBillingAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Client, (client) => client.billingAddresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column('uuid')
  clientId: string;

  @Column('text')
  alias: string;

  @Column('text')
  neighborhood: string; // Colonia

  @Column('text')
  state: string; // Estado

  @Column('text')
  streetAndNumber: string; // Calle y numero

  @Column('text')
  municipality: string; // Municipio

  @Column('integer')
  postalCode: number; // Código Postal

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('boolean', { default: false })
  isDefault: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
