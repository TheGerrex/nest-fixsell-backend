import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../../entities/client.entity';

@Entity('client_suspension_configs')
export class ClientSuspensionConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Client, (client) => client.suspensionConfig, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column('uuid')
  clientId: string;

  // Validar por fecha limite de pago (Validate by payment due date)
  @Column('boolean', { default: false })
  validateByDueDate: boolean;

  // Suspender para servicio: refacciones y consumibles (Suspend for service parts and consumables)
  @Column('boolean', { default: false })
  suspendForServiceAndParts: boolean;

  // Suspender para documentos de ventas (Suspend for sales documents)
  @Column('boolean', { default: false })
  suspendForSalesDocuments: boolean;

  // Dias de gracia (Grace days)
  @Column('integer', { default: 0 })
  graceDays: number;

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
