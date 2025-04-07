import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Notification } from '../entities/notification.entity';

@WebSocketGateway({ namespace: 'notifications', cors: true })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  // Track connected users
  private userSockets: Map<string, string[]> = new Map();

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      // Get token from handshake auth or headers
      const token =
        client.handshake.auth.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.error('No token provided');
        client.disconnect();
        return;
      }

      // Verify and decode JWT
      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub || decoded.id;

      if (!userId) {
        this.logger.error('Invalid token - no user ID');
        client.disconnect();
        return;
      }

      // Store user connection
      client.data.userId = userId;

      // Add to user's room for targeted messages
      client.join(`user:${userId}`);

      // Track socket ID for this user
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, []);
      }
      this.userSockets.get(userId).push(client.id);

      this.logger.log(`Client connected to notifications: ${userId}`);
    } catch (error) {
      this.logger.error(`Socket connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = client.data?.userId;
    if (userId) {
      // Remove this socket from user's socket list
      const userSockets = this.userSockets.get(userId) || [];
      const updatedSockets = userSockets.filter((id) => id !== client.id);

      if (updatedSockets.length === 0) {
        this.userSockets.delete(userId);
      } else {
        this.userSockets.set(userId, updatedSockets);
      }

      this.logger.log(`Client disconnected from notifications: ${userId}`);
    }
  }

  @OnEvent('notification.created')
  handleNotificationCreated(notification: Notification): void {
    this.server
      .to(`user:${notification.recipientId}`)
      .emit('notification', notification);
  }

  @SubscribeMessage('mark-as-read')
  handleMarkAsRead(client: Socket, notificationId: string): void {
    // You can implement additional logic here if needed
    // For now just logging
    this.logger.log(
      `Notification ${notificationId} marked as read by ${client.data.userId}`,
    );
  }
}
