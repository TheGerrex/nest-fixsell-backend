import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Printer } from 'src/printers/entities/printer.entity';

@Entity()
export class Deal {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Printer, (printer) => printer.deal)
  printer: Printer;

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
