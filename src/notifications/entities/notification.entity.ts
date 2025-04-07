import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum NotificationType {
  SYSTEM = 'system',
  TASK = 'task',
  ALERT = 'alert',
  MESSAGE = 'message',

  // Inventory related
  PRODUCT_LOW_STOCK = 'product_low_stock',
  PRODUCT_OUT_OF_STOCK = 'product_out_of_stock',
  RECEPTION_COMPLETED = 'reception_completed',

  // Support related
  TICKET_CREATED = 'ticket_created',
  TICKET_UPDATED = 'ticket_updated',
  TICKET_ASSIGNED = 'ticket_assigned',
  TICKET_RESOLVED = 'ticket_resolved',

  // Sales related
  LEAD_CREATED = 'lead_created',
  LEAD_ASSIGNED = 'lead_assigned',
  LEAD_CONVERTED = 'lead_converted',
  DEAL_CREATED = 'deal_created',
  DEAL_UPDATED = 'deal_updated',
  DEAL_CLOSED = 'deal_closed',

  // E-commerce related
  ORDER_PLACED = 'order_placed',
  ORDER_PROCESSED = 'order_processed',
  ORDER_SHIPPED = 'order_shipped',
  ORDER_DELIVERED = 'order_delivered',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_FAILED = 'payment_failed',

  // Client related
  CLIENT_REGISTERED = 'client_registered',
  CLIENT_UPDATED = 'client_updated',

  // Event related
  EVENT_CREATED = 'event_created',
  EVENT_UPDATED = 'event_updated',
  EVENT_REMINDER = 'event_reminder',

  // Activity related
  ACTIVITY_ASSIGNED = 'activity_assigned',
  ACTIVITY_COMPLETED = 'activity_completed',
  ACTIVITY_DEADLINE = 'activity_deadline',

  // Software related
  SOFTWARE_UPDATED = 'software_updated',
  SOFTWARE_LICENSE_EXPIRING = 'software_license_expiring',

  // File upload related
  FILE_UPLOADED = 'file_uploaded',
  FILE_SHARED = 'file_shared',

  // Package related
  PACKAGE_CREATED = 'package_created',
  PACKAGE_UPDATED = 'package_updated',

  // Changelog related
  SYSTEM_UPDATED = 'system_updated',

  // Currency related
  CURRENCY_RATE_CHANGED = 'currency_rate_changed',
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  @Index()
  status: NotificationStatus;

  // For linking to relevant entity (e.g., ticket ID, order ID)
  @Column({ nullable: true })
  entityId: string;

  @Column({ nullable: true })
  entityType: string;

  // Store additional contextual data
  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column()
  @Index()
  recipientId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
