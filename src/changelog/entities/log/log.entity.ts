import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ nullable: true })
  userName: string; // New: User's name

  @Column()
  action: string;

  @Column()
  entity: string;

  @Column()
  entityId: string;

  @Column('json', { nullable: true })
  changes: Record<string, any>;

  @Column({ type: 'varchar', default: 'unknown' })
  method: string; // HTTP method (e.g., GET, POST)

  @Column({ type: 'varchar', default: '/' })
  url: string; // Request URL

  @Column({ type: 'varchar', default: '0.0.0.0' })
  ip: string; // Client IP address

  @CreateDateColumn()
  timestamp: Date;
}
