import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  Notification,
  NotificationStatus,
  NotificationType,
} from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create(
      createNotificationDto,
    );
    const savedNotification = await this.notificationsRepository.save(
      notification,
    );

    // Emit event for real-time notification delivery
    this.eventEmitter.emit('notification.created', savedNotification);

    return savedNotification;
  }

  async findAllForUser(
    userId: string,
    options?: { status?: NotificationStatus },
  ): Promise<Notification[]> {
    const queryBuilder = this.notificationsRepository
      .createQueryBuilder('notification')
      .where('notification.recipientId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (options?.status) {
      queryBuilder.andWhere('notification.status = :status', {
        status: options.status,
      });
    }

    return queryBuilder.getMany();
  }

  async findAllNotifications(): Promise<Notification[]> {
    return this.notificationsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.status = NotificationStatus.READ;
    return this.notificationsRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.update(
      { recipientId: userId, status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ },
    );
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.findOne(id);
    Object.assign(notification, updateNotificationDto);
    return this.notificationsRepository.save(notification);
  }

  async remove(id: string): Promise<void> {
    const result = await this.notificationsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.count({
      where: {
        recipientId: userId,
        status: NotificationStatus.UNREAD,
      },
    });
  }

  @OnEvent('ticket.created')
  async handleTicketCreatedEvent(payload: { ticket: any }): Promise<void> {
    console.log('Ticket created event received:', payload.ticket);
    const createNotificationDto: CreateNotificationDto = {
      type: NotificationType.TICKET_CREATED,
      title: 'New Ticket Created',
      message: `A new ticket (ID: ${payload.ticket.id}) has been created.`,
      recipientId: payload.ticket.assigned?.id || '',
      status: NotificationStatus.UNREAD,
      entityId: payload.ticket.id.toString(),
      entityType: 'ticket',
      data: { ...payload.ticket }, // or select specific details
    };

    await this.create(createNotificationDto);
  }
}
