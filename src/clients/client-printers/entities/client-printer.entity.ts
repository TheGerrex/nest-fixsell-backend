import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';
import { Printer } from 'src/printers/entities/printer.entity';

export enum ClientPrinterPurchaseStatus {
  RENTED = 'rented',
  PURCHASED = 'purchased',
}

@Entity('client_printers')
export class ClientPrinter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Link to the client who owns the printer
  @ManyToOne(() => Client, (client) => client.clientPrinters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clientId' })
  client: Client;

  @Column('uuid')
  clientId: string;

  // Link to the global Printer catalog
  @ManyToOne(() => Printer, { eager: true })
  @JoinColumn({ name: 'printerId' })
  printer: Printer;

  @Column('uuid')
  printerId: string;

  // Extra client-specific printer info
  @Column({ nullable: true })
  macAddress: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({
    type: 'enum',
    enum: ClientPrinterPurchaseStatus,
    nullable: true,
  })
  purchaseStatus: ClientPrinterPurchaseStatus;

  // Additional fields from provided data
  @Column({ nullable: true })
  smtpServer: string;

  @Column({ type: 'int', nullable: true })
  smtpPort: number;

  @Column({ nullable: true })
  smtpSecurity: string;

  @Column({ nullable: true })
  smtpEmail: string;

  @Column({ nullable: true })
  smtpPassword: string;

  @Column({ nullable: true })
  devicePassword: string;

  @Column({ nullable: true })
  billingDay: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  location: string;
}
