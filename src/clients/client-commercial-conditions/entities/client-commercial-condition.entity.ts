import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../entities/client.entity';
import { User } from '../../../auth/entities/user.entity';
import { Currency } from '../../interfaces/currency.enum';
import { DayOfWeek } from '../../interfaces/dayofweek.enum';

@Entity('client_commercial_conditions')
export class ClientCommercialCondition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Client, (client) => client.commercialConditions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column('uuid')
  clientId: string;

  // Ejecutivo asignado (Assigned Executive)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assignedExecutiveId' })
  assignedExecutive: User;

  @Column('uuid', { nullable: true })
  assignedExecutiveId: string;

  // Dias de credito (Credit days)
  @Column('integer', { default: 0 })
  creditDays: number;

  // Ejecutivo de cobranza (Collection Executive)
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'collectionExecutiveId' })
  collectionExecutive: User;

  @Column('uuid', { nullable: true })
  collectionExecutiveId: string;

  // Monto limite de credito (Credit limit amount)
  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  creditLimit: number;

  // Cliente activo (Active client) - this is redundant as we already have isActive in Client entity
  // but we're adding it here as per the requirement
  @Column('boolean', { default: true })
  isActiveClient: boolean;

  // Aplicar retencion I.V.A (Apply VAT withholding)
  @Column('boolean', { default: false })
  applyVatWithholding: boolean;

  // Validar limite de credito en documentos de venta (Validate credit limit in sales documents)
  @Column('boolean', { default: true })
  validateCreditLimitInSales: boolean;

  // Observaciones para cobranza (Collection observations)
  @Column('text', { nullable: true })
  collectionObservations: string;

  // Moneda (Currency)
  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.MXN,
  })
  currency: Currency;

  // Dias de revision (Review days)
  @Column('simple-array', { default: '' })
  reviewDays: DayOfWeek[];

  // Dias de pago (Payment days)
  @Column('simple-array', { default: '' })
  paymentDays: DayOfWeek[];

  // Standard fields
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
