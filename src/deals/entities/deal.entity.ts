import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Printer } from 'src/printers/entities/printer.entity';
import { Consumible } from '../../ecommerce/consumibles/entities/consumible.entity';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class Deal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, (event) => event.deals, {
    nullable: true,
    onDelete: 'CASCADE', // Elimina el deal al eliminar el evento
  })
  event: Event;

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
