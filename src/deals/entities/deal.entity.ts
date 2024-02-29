import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Printer } from 'src/printers/entities/printer.entity';
import { Consumible } from '../../ecommerce/consumibles/entities/consumible.entity';

@Entity()
export class Deal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Printer, (printer) => printer.deals, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  printer: Printer;

  @ManyToOne(() => Consumible, (consumible) => consumible.deals, {
    nullable: true,
    onDelete: 'CASCADE',
  })
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
