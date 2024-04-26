import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Lead } from 'src/sales/leads/entities/lead.entity';

export enum Type {
  EMAIL = 'email',
  CALL = 'llamada',
  MEETING = 'reunión',
  Manual = 'manual',
}

@Entity()
export class SaleCommunication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  date: Date;

  @Column({ nullable: true })
  type: Type | null;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Lead, (lead) => lead.communications, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  lead: Lead;
}
