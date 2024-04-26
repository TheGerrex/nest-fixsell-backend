import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum Status {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WITHOUT_RESOLUTION = 'without_resolution',
  COMPLETED = 'completed',
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  clientName: string;

  @Column({ nullable: true })
  clientEmail: string;

  @Column({ nullable: true })
  clientPhone: string;

  @ManyToOne(() => User)
  assigned: User;

  @ManyToOne(() => User)
  assignee: User;

  @Column({ nullable: true })
  issue: string;

  @Column({ nullable: true })
  activity: string;

  @Column({
    type: 'enum',
    enum: Priority,
    nullable: true,
  })
  priority: Priority;

  @Column({
    type: 'enum',
    enum: Status,
    nullable: true,
  })
  status: Status;

  @Column('text', { array: true, nullable: true })
  ticketFiles: string[];

  @CreateDateColumn({ nullable: true })
  createdDate: Date;

  @UpdateDateColumn({ nullable: true })
  updatedDate: Date;
}
