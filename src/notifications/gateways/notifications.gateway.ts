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
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ namespace: 'notifications', cors: true })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server: Server;

  // Track connected users
  private userSockets: Map<string, string[]> = new Map();

  constructor(
    private jwtService: JwtService,
    private ConfigService: ConfigService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      this.logger.log(`New connection attempt from client ID: ${client.id}`);

      // Get token from handshake auth or headers
      const authToken = client.handshake.auth.token;
      const headerToken = client.handshake.headers.authorization;

      this.logger.log(`Auth token present: ${!!authToken}`);
      this.logger.log(`Header authorization present: ${!!headerToken}`);

      const token = authToken || headerToken?.split(' ')[1];

      if (!token) {
        this.logger.error('No token provided');
        client.disconnect();
        return;
      }

      // Log partial token for debugging (never log full tokens in production)
      this.logger.log(`Token starts with: ${token.substring(0, 10)}...`);

      try {
        // Verify and decode JWT with secret provided from ConfigService
        const jwtSecret = this.ConfigService.get<string>('JWT_SEED');
        const decoded = this.jwtService.verify(token, { secret: jwtSecret });
        this.logger.log('Token verification successful');
        this.logger.log(
          `Token payload: ${JSON.stringify({
            sub: decoded.sub || decoded.id,
            exp: decoded.exp,
            iat: decoded.iat,
          })}`,
        );

        const userId = decoded.sub || decoded.id;

        if (!userId) {
          this.logger.error('Invalid token - no user ID found in payload');
          client.disconnect();
          return;
        }

        // Store user connection
        client.data.userId = userId;

        // Add to user's room for targeted messages
        client.join(`user:${userId}`);
        this.logger.log(`Client joined room: user:${userId}`);

        // Track socket ID for this user
        if (!this.userSockets.has(userId)) {
          this.userSockets.set(userId, []);
          this.logger.log(`Created new socket list for user: ${userId}`);
        }
        this.userSockets.get(userId).push(client.id);
        this.logger.log(
          `Added socket ${client.id} to user ${userId}, count: ${
            this.userSockets.get(userId).length
          }`,
        );

        this.logger.log(`Client successfully connected: ${userId}`);
      } catch (jwtError) {
        this.logger.error(`JWT verification error: ${jwtError.message}`);
        if (jwtError.name === 'TokenExpiredError') {
          this.logger.error(
            `Token expired at: ${new Date(jwtError.expiredAt)}`,
          );
        }
        client.disconnect();
      }
    } catch (error) {
      this.logger.error(`Socket connection general error: ${error.message}`);
      this.logger.error(`Error stack: ${error.stack}`);
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
    this.logger.log(
      `Notification ${notificationId} marked as read by ${client.data.userId}`,
    );
  }
}
