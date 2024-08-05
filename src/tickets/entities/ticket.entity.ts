import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Activity } from 'src/activity/entities/activity.entity';

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

export enum Type {
  REMOTE = 'remote',
  ON_SITE = 'on-site',
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  // type: remote or on-site
  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  clientName: string;

  @Column({ nullable: true })
  clientEmail: string;

  @Column({ nullable: true })
  clientPhone: string;

  // client address
  @Column({ nullable: true })
  clientAddress: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  assigned: User;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn()
  assignee: User;

  @Column({ nullable: true })
  issue: string;

  // @Column('text', { array: true, nullable: true })
  // activity: string[];

  @OneToMany(() => Activity, (activity) => activity.ticket, {
    onDelete: 'SET NULL',
  })
  activities: Activity[];

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

  @Column({ type: 'timestamp', nullable: true })
  appointmentStartTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  appointmentEndTime: Date;
}
