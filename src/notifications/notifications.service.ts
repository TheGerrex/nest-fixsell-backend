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

    // Emitir evento para la entrega de notificaciones en tiempo real
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
      throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
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
      throw new NotFoundException(`Notificación con ID ${id} no encontrada`);
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
    console.log('Evento de ticket creado recibido:', payload.ticket);
    const createNotificationDto: CreateNotificationDto = {
      type: NotificationType.TICKET_CREATED,
      title: 'Nuevo ticket creado',
      message: `Se ha creado un nuevo ticket (ID: ${payload.ticket.id} Cliente: ${payload.ticket.clientName}).`,
      recipientId: payload.ticket.assigned?.id || '',
      status: NotificationStatus.UNREAD,
      entityId: payload.ticket.id.toString(),
      entityType: 'ticket',
      data: { ...payload.ticket },
    };

    await this.create(createNotificationDto);
  }

  @OnEvent('ticket.updated')
  async handleTicketUpdatedEvent(payload: {
    ticket: any;
    changes: any;
  }): Promise<void> {
    console.log('Evento de ticket actualizado recibido:', payload.ticket);

    const ticket = payload.ticket;
    const changes = payload.changes;

    // Create a list of users who should be notified
    const notifyUserIds = new Set<string>();

    // Always notify the assigned user if available
    if (ticket.assigned?.id) {
      notifyUserIds.add(ticket.assigned.id);
    }

    // Always notify the assignee user if available
    if (ticket.assignee?.id) {
      notifyUserIds.add(ticket.assignee.id);
    }

    // If the update came from a specific user, add their ID
    if (changes.updatedBy) {
      notifyUserIds.add(changes.updatedBy);
    }

    // Prepare notification title and message
    let title = 'Ticket actualizado';
    let detailMessage = '';

    if (changes.status) {
      title = `Ticket cambiado a ${changes.status}`;
      detailMessage += ` Estado actualizado a "${changes.status}".`;
    }

    if (changes.priority) {
      detailMessage += ` Prioridad actualizada a "${changes.priority}".`;
    }

    if (changes.assigned) {
      detailMessage += ` Asignado a un nuevo usuario.`;
    }

    if (changes.appointmentStartTime || changes.appointmentEndTime) {
      detailMessage += ` Horario de la cita actualizado.`;
    }

    // Send notifications to all relevant users
    for (const userId of notifyUserIds) {
      const createNotificationDto: CreateNotificationDto = {
        type: NotificationType.TICKET_UPDATED,
        title: title,
        message: `El ticket #${ticket.id} (${ticket.clientName}) ha sido actualizado.${detailMessage}`,
        recipientId: userId,
        status: NotificationStatus.UNREAD,
        entityId: ticket.id.toString(),
        entityType: 'ticket',
        data: {
          ...ticket,
          changes: Object.keys(changes),
        },
      };

      await this.create(createNotificationDto);
    }
  }

  @OnEvent('lead.created')
  async handleLeadCreatedEvent(payload: { lead: any }): Promise<void> {
    console.log('Evento de lead creado recibido:', payload.lead);

    // Create notification for the assigned user
    if (payload.lead.assigned?.id) {
      const createNotificationDto: CreateNotificationDto = {
        type: NotificationType.LEAD_CREATED,
        title: 'Nuevo lead creado',
        message: `Se ha creado un nuevo lead (ID: ${payload.lead.id}, Cliente: ${payload.lead.client}).`,
        recipientId: payload.lead.assigned.id,
        status: NotificationStatus.UNREAD,
        entityId: payload.lead.id.toString(),
        entityType: 'lead',
        data: { ...payload.lead },
      };

      await this.create(createNotificationDto);
    }
  }

  @OnEvent('lead.assigned')
  async handleLeadAssignedEvent(payload: {
    lead: any;
    previousAssignedId?: string;
  }): Promise<void> {
    console.log('Evento de lead asignado recibido:', payload.lead);

    // If there's a newly assigned user, notify them
    if (payload.lead.assigned?.id) {
      const createNotificationDto: CreateNotificationDto = {
        type: NotificationType.LEAD_ASSIGNED,
        title: 'Nuevo lead asignado',
        message: `Se te ha asignado el lead #${payload.lead.id} (${payload.lead.client}).`,
        recipientId: payload.lead.assigned.id,
        status: NotificationStatus.UNREAD,
        entityId: payload.lead.id.toString(),
        entityType: 'lead',
        data: { ...payload.lead },
      };

      await this.create(createNotificationDto);
    }
  }

  @OnEvent('lead.updated')
  async handleLeadUpdatedEvent(payload: {
    lead: any;
    changes: any;
  }): Promise<void> {
    console.log('Evento de lead actualizado recibido:', payload.lead);

    const lead = payload.lead;
    const changes = payload.changes;

    // Create a set of user IDs to notify
    const notifyUserIds = new Set<string>();

    // Always notify the assigned user if available
    if (lead.assigned?.id) {
      notifyUserIds.add(lead.assigned.id);
    }

    // Prepare notification title and message
    let title = 'Lead actualizado';
    let detailMessage = '';

    if (changes.status) {
      title = `Lead cambiado a ${changes.status}`;
      detailMessage += ` Estado actualizado a "${changes.status}".`;
    }

    if (changes.priority) {
      detailMessage += ` Prioridad actualizada a "${changes.priority}".`;
    }

    // Send notifications to all relevant users
    for (const userId of notifyUserIds) {
      const createNotificationDto: CreateNotificationDto = {
        type: NotificationType.DEAL_UPDATED,
        title: title,
        message: `El lead #${lead.id} (${lead.client}) ha sido actualizado.${detailMessage}`,
        recipientId: userId,
        status: NotificationStatus.UNREAD,
        entityId: lead.id.toString(),
        entityType: 'lead',
        data: {
          ...lead,
          changes: Object.keys(changes),
        },
      };

      await this.create(createNotificationDto);
    }
  }
}
