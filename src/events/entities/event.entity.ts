import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Deal } from '../../deals/entities/deal.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  image: string;

  @Column()
  title: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  description: string;

  @OneToMany(() => Deal, (deal) => deal.event, {
    nullable: true,
    cascade: true,
    onDelete: 'CASCADE', // cascade deletes the deals when the event is deleted
  })
  deals: Deal[];
}
