import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Deal } from 'src/deals/entities/deal.entity';
import { Package } from 'src/packages/entities/package.entity';
import { Consumible } from 'src/ecommerce/consumibles/entities/consumible.entity';

@Entity()
export class Printer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  brand: string;

  @Column({ unique: true, nullable: false })
  model: string;

  @Column({ nullable: true })
  datasheet_url: string;

  @Column('text', { array: true, nullable: true })
  img_url: string[];

  @Column({ nullable: true })
  description: string;

  @Column('float', { default: 100, nullable: true })
  price: number;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  color: boolean;

  @Column({ nullable: true })
  rentable: boolean;

  @Column({ nullable: true })
  sellable: boolean;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ nullable: true })
  powerConsumption: string;

  @Column({ nullable: true })
  dimensions: string;

  @Column('int', { nullable: true })
  printVelocity: number;

  @Column({ nullable: true })
  maxPrintSizeSimple: string;

  @Column({ nullable: true })
  maxPrintSize: string;

  @Column({ nullable: true })
  printSize: string;

  @Column('integer', { nullable: true })
  maxPaperWeight: number;

  @Column({ nullable: true })
  duplexUnit: boolean;

  @Column({ nullable: true })
  paperSizes: string;

  @Column({ nullable: true })
  applicableOS: string;

  @Column({ nullable: true, default: 'Impresión, copiado y escaneo' })
  printerFunctions: string;

  @Column('text', { array: true, nullable: true })
  barcode: string[];

  @OneToOne(() => Deal, (deal) => deal.printer, { nullable: true, eager: true })
  @JoinColumn()
  deal: Deal;

  @OneToOne(() => Package, (package_) => package_.printer, {
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  packages: Package;

  @ManyToMany(() => Consumible, (consumible) => consumible.printers, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  consumibles: Consumible[];
}
