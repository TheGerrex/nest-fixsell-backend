import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Printer } from 'src/printers/entities/printer.entity';
import { Consumible } from '../../ecommerce/consumibles/entities/consumible.entity';

@Entity()
export class Deal {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Printer, (printer) => printer.deal)
  printer: Printer;

  @OneToOne(() => Consumible, (consumible) => consumible.deal)
  consumible: Consumible;

  @Column({ type: 'timestamp', nullable: true })
  dealEndDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  dealStartDate: Date;

  @Column({ type: 'decimal', nullable: true })
  dealPrice: number;

  @Column({ type: 'text', nullable: true })
  dealCurrency: string;

  @Column({ type: 'decimal', nullable: true })
  dealDiscountPercentage: number;

  @Column({ type: 'text', nullable: true })
  dealDescription: string;
}
