import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class ChatHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomId: string;

  @Column()
  senderId: string;

  @Column({ nullable: true })
  senderName: string;

  @Column()
  message: string;

  @Column()
  timestamp: Date;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: 'text' })
  messageType: 'text' | 'form';

  @Column({ nullable: true, type: 'json' })
  formData: any;
}
