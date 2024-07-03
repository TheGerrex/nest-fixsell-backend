import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatbotService } from './chatbot.service';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload';
import { get } from 'http';

@WebSocketGateway({ cors: true })
export class ChatbotGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const role = client.handshake.auth.role;

    if (!token || !role) {
      console.error('Missing authentication or role information');
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token);

      if (role === 'admin') {
        await this.handleAdminConnection(client, payload);
      } else if (role === 'user') {
        await this.handleUserConnection(client, payload);
      } else {
        console.error('Unknown role:', role);
        client.disconnect();
      }
    } catch (error) {
      console.error('Failed to verify token:', error);
      client.disconnect();
    }
  }

  async handleAdminConnection(client: Socket, payload: any) {
    console.log('connecting as admin...');
    const roomName = client.handshake.auth.roomName;
    await this.chatbotService.registerAdmin(client, payload.id, roomName);
    client.join(roomName);
    console.log('Admin emitting room-joined with name:', roomName);
    client.emit('room-joined', roomName);
    this.wss.to(roomName).emit('admin-joined', {
      FullName: 'Admin',
      Message: 'An admin has joined the room.',
      RoomName: roomName,
    });
  }

  async handleUserConnection(client: Socket, payload: any) {
    console.log('connecting as user...');
    const roomName = `room_${payload.id}`;
    await this.chatbotService.registerUser(client, payload.id);
    client.join(roomName);
    console.log('User emitting room-joined with name:', roomName);
    client.emit('room-joined', roomName);
    this.wss.to(roomName).emit('user-joined', {
      FullName: 'User',
      Message: 'A user has joined the room.',
      RoomName: roomName,
    });
    // Emit greeting message to the correctly named room
    this.wss.to(roomName).emit('message-from-server', {
      FullName: 'Fixi',
      Message:
        '¡Hola! Bienvenido al chat de soporte. ¿Cómo puedo ayudarte hoy?',
      RoomName: roomName,
    });
    console.log(`Emitting from server the initial greeting to ${roomName}`);
    // Update clients list (if necessary)
    this.wss.emit('clients-updated', this.chatbotService.getConnectedClients());
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client.id);
    this.chatbotService.removeClient(client.id);
    this.wss.emit('clients-updated', this.chatbotService.getConnectedClients());
  }

  // message-from-client
  @SubscribeMessage('message-from-client')
  async handleMessage(client: Socket, payload: NewMessageDto) {
    console.log(
      `[handleMessage] Received message from client ${client.id}:`,
      payload.message,
    );
    const roomName = `${this.chatbotService.getClientRoom(client.id)}`;
    console.log(`[handleMessage] Room name resolved as: ${roomName}`);

    let responseMessage = '';

    const currentState = this.chatbotService.getConversationState(client.id);
    console.log(
      `[handleMessage] Current state for client ${client.id}: ${currentState}`,
    );

    switch (currentState) {
      case 'initialGreeting':
        responseMessage =
          'Para darte una atención más personalizada ¿Me podrías indicar tu nombre?';
        this.chatbotService.updateConversationState(client.id, 'awaitingName');
        console.log(
          `[handleMessage] State updated to awaitingName for client ${client.id}`,
        );
        break;
      case 'awaitingName':
        if (payload.message.trim()) {
          this.chatbotService.saveConversationData(client.id, {
            name: payload.message,
          });
          responseMessage = 'Gracias ¿Podrías indicarme tu email?';
          this.chatbotService.updateConversationState(
            client.id,
            'awaitingEmail',
          );
          console.log(
            `[handleMessage] State updated to awaitingEmail for client ${client.id}`,
          );
        } else {
          responseMessage =
            'Parece que no recibí un nombre válido. ¿Me podrías decir tu nombre, por favor?';
          console.log(
            `[handleMessage] Invalid name received from client ${client.id}`,
          );
        }
        break;
      case 'awaitingEmail':
        if (payload.message.includes('@')) {
          this.chatbotService.saveConversationData(client.id, {
            email: payload.message,
          });
          responseMessage = 'Gracias ¿Podrías indicarme tu número de teléfono?';
          this.chatbotService.updateConversationState(
            client.id,
            'awaitingPhoneNumber',
          );
          console.log(
            `[handleMessage] State updated to awaitingPhoneNumber for client ${client.id}`,
          );
        } else {
          responseMessage =
            'Parece que el email no es válido. ¿Podrías indicarme tu email?';
          console.log(
            `[handleMessage] Invalid email received from client ${client.id}`,
          );
        }
        break;
      case 'awaitingPhoneNumber':
        this.chatbotService.saveConversationData(client.id, {
          phoneNumber: payload.message,
        });
        responseMessage =
          'Gracias, hemos completado el registro. Nos pondremos en contacto contigo pronto.';
        this.chatbotService.updateConversationState(client.id, 'completed');
        console.log(
          `[handleMessage] State updated to completed for client ${client.id}`,
        );
        this.chatbotService.saveConversationToDatabase(client.id);
        console.log(
          `[handleMessage] Conversation saved to database for client ${client.id}`,
        );
        break;
      default:
        console.log(
          `[handleMessage] Unhandled state: ${currentState} for client ${client.id}`,
        );
        // Handle other states or default message.
        break;
    }

    // Correct way to emit to the room
    this.wss.to(roomName).emit('message-from-server', {
      FullName: 'You',
      Message: payload.message,
      RoomName: roomName, // Include the room name in the payload
    });

    // Log the emission
    console.log(
      `[handleMessage] Event 'message-from-server' emitted to room: ${roomName} with payload: `,
      {
        FullName: 'You',
        Message: payload.message,
        RoomName: roomName,
      },
    );

    // Emit the bot's response to the room
    if (responseMessage) {
      this.wss.to(roomName).emit('message-from-server', {
        FullName: 'Fixi',
        Message: responseMessage,
        RoomName: roomName, // Include the room name in the payload
      });

      console.log(
        `[handleMessage] Bot's response emitted to room: ${roomName} with message: ${responseMessage}`,
      );
    }
  }
}
