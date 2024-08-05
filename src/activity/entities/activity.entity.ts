import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ticket } from 'src/tickets/entities/ticket.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @ManyToOne(() => User)
  addedBy: User; // or a relation to a User entity

  @CreateDateColumn()
  addedAt: Date;

  // ticket relation
  @ManyToOne(() => Ticket, (ticket) => ticket.activities, {
    onDelete: 'SET NULL',
  })
  ticket: Ticket;
}
