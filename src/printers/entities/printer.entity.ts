import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Deal } from 'src/deals/entities/deal.entity';

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

  @Column('text', { array: true, nullable: false })
  img_url: string[];

  @Column({ nullable: false })
  description: string;

  @Column('decimal', { nullable: false })
  price: number;

  @Column({ nullable: false })
  category: string;

  @Column({ nullable: false })
  color: boolean;

  @Column({ nullable: false })
  rentable: boolean;

  @Column({ nullable: false })
  powerConsumption: string;

  @Column({ nullable: false })
  dimensions: string;

  @Column({ nullable: false })
  printVelocity: string;

  @Column({ nullable: true })
  maxPrintSizeSimple: string;

  @Column({ nullable: false })
  maxPrintSize: string;

  @Column({ nullable: false })
  printSize: string;

  @Column({ nullable: false })
  maxPaperWeight: string;

  @Column({ nullable: false })
  duplexUnit: boolean;

  @Column({ nullable: false })
  paperSizes: string;

  @Column({ nullable: false })
  applicableOS: string;

  @Column({ nullable: false })
  printerFunctions: string;

  @Column('text', { array: true, nullable: false })
  barcode: string[];

  @OneToOne(() => Deal, (deal) => deal.printer, { nullable: true, eager: true })
  @JoinColumn()
  deal: Deal;
}
