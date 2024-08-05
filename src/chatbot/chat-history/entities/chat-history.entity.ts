import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ChatHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: string;

  @Column()
  senderId: string;

  @Column()
  message: string;

  @Column()
  timestamp: Date;
}
