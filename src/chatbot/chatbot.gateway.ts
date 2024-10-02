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

@WebSocketGateway({ cors: true })
export class ChatbotGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  private clientRoles = new Map<string, string>();
  private botActiveStatusPerRoom: Map<string, boolean> = new Map();
  private clientRoomMap = new Map<string, string>();
  // Define getBotContinuationMessage as a method within the class
  private getBotContinuationMessage(state: string): string {
    switch (state) {
      case 'awaitingName':
        return 'Continuando... Por favor, indícame tu nombre.';
      case 'awaitingEmail':
        return '¿Me podrías indicar tu email?';
      case 'awaitingPhoneNumber':
        return 'Por favor, proporciona tu número de teléfono.';
      default:
        return 'El bot ha retomado. Estoy aquí para ayudar.';
    }
  }
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    const role = client.handshake.auth.role;
    this.clientRoles.set(client.id, role);

    try {
      if (role === 'admin') {
        const payload = this.jwtService.verify(token);
        await this.handleAdminConnection(client, payload);
      } else if (role === 'user') {
        console.log('connecting as user...', client.handshake.auth);
        await this.handleUserConnection(client, client.handshake.auth);
      } else {
        console.error('Unknown role:', role);
        client.disconnect();
      }
    } catch (error) {
      console.error('Failed to verify token:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);

    // Get necessary information before removing the client
    if (this.clientRoles.get(client.id) === 'admin') {
      console.log('calling handleAdminDisconnect');
      // Pass the necessary client data
      this.handleAdminDisconnect(client);
    } else {
      // Emit updated clients' list before removal for non-admin
      this.wss.emit(
        'clients-updated',
        this.chatbotService.getConnectedClients(),
      );
      this.chatbotService.removeClient(client.id);
    }
    // Emit updated clients’ list for API after any type of client removal
    this.wss.emit(
      'clients-updated',
      this.chatbotService.getConnectedClientsForAPI(),
    );
  }

  async handleAdminConnection(client: Socket, payload: any) {
    console.log('connecting as admin...');
    console.log('Payload received:', payload);
    console.log('client handshake:', client.handshake.auth);
    const roomName = client.handshake.auth.roomName;
    this.botActiveStatusPerRoom.set(roomName, false);
    this.clientRoomMap.set(client.id, roomName);

    try {
      await this.chatbotService.registerAdmin(client, payload.id, roomName);
      console.log('Admin registered with ID:', payload.id);
    } catch (error) {
      console.error('Failed to register admin:', error);
      client.disconnect();
      return;
    }

    const adminName = this.chatbotService.getUserFullName(client.id);
    if (!adminName) {
      console.error('Failed to retrieve admin name');
      client.disconnect();
      return;
    }

    client.join(roomName);
    console.log('Admin emitting room-joined with name:', roomName);

    await this.chatbotService.saveChatMessage(
      roomName,
      'Fixy',
      `${adminName} se ha unido a la conversación.`,
    );
    client.emit('room-joined', roomName);
    this.wss.to(roomName).emit('message-from-server', {
      FullName: adminName,
      Message: `${adminName} se ha unido a la conversación.`,
      RoomName: roomName,
    });
  }

  handleAdminDisconnect(client: Socket) {
    console.log('Admin disconnected:', client.id);
    const roomName = this.clientRoomMap.get(client.id);
    if (!roomName) {
      console.error('Failed to retrieve room name for admin:', client.id);
      return;
    }

    const adminName = this.chatbotService.getUserFullName(client.id);
    if (!adminName) {
      console.error('Failed to retrieve admin name');
      return;
    }

    this.chatbotService.removeClient(client.id);
    this.botActiveStatusPerRoom.set(roomName, true);

    this.chatbotService.saveChatMessage(
      roomName,
      'Fixy',
      `${adminName} ha abandonado la conversación. El bot ha retomado la conversación.`,
    );

    this.wss.to(roomName).emit('message-from-server', {
      FullName: 'Fixy',
      Message: `${adminName} ha abandonado la conversación. El bot ha retomado la conversación.`,
      RoomName: roomName,
    });

    if (this.isBotActiveForRoom(roomName)) {
      // Fetch and transition state correctly
      const prevClientId = Array.from(
        this.chatbotService.getConnectedClients(),
      ).find((client) => client.roomName === roomName)?.id;
      if (prevClientId) {
        const conversationState =
          this.chatbotService.getConversationState(prevClientId);
        let responseMessage = this.getBotContinuationMessage(conversationState);

        if (responseMessage) {
          this.chatbotService.saveChatMessage(
            roomName,
            'Fixy',
            responseMessage,
          );
          this.wss.to(roomName).emit('message-from-server', {
            FullName: 'Fixy',
            Message: responseMessage,
            RoomName: roomName,
            isAdmin: false,
          });
        }
        // Consider updating state if needed for continuing conversation
        this.chatbotService.updateConversationState(
          prevClientId,
          conversationState,
        );
      }
    }

    console.log(`Bot has resumed operations in room: ${roomName}`);
    this.clientRoomMap.delete(client.id);
  }

  async handleUserConnection(client: Socket, payload: any) {
    console.log('connecting as user...');
    let roomName = payload.roomName;
    const savedState = payload.savedState;
    console.log('Payload received for user...:', payload);
    this.clientRoomMap.set(client.id, roomName);
    if (roomName) {
      console.log(`Connecting to existing room: ${roomName}`);
      const chatHistory = await this.chatbotService.getChatHistory(roomName);
      client.emit('chatHistory', chatHistory);
    } else {
      roomName = await this.chatbotService.registerUser(client, payload.id);
    }

    await this.chatbotService.registerUser(
      client,
      payload.id,
      roomName,
      savedState,
    );

    client.join(roomName);
    console.log('User emitting room-joined with name:', roomName);
    client.emit('room-joined', roomName);

    this.wss.to(roomName).emit('user-joined', {
      FullName: 'User',
      Message: 'A user has joined the room.',
      RoomName: roomName,
    });

    if (savedState) {
      client.emit('chatState', savedState);
    } else {
      const initialState = 'initialGreeting';
      await this.chatbotService.saveChatMessage(
        roomName,
        'Fixy',
        '¡Hola! 👋 Estoy aquí para ayudarte en lo que necesites.',
      );

      this.wss.to(roomName).emit('message-from-server', {
        FullName: 'Fixy',
        Message: '¡Hola! 👋 Estoy aquí para ayudarte en lo que necesites.',
        RoomName: roomName,
      });

      client.emit('chatState', initialState);
    }

    this.wss.emit('clients-updated', this.chatbotService.getConnectedClients());
  }

  isBotActiveForRoom(roomName: string): boolean {
    return this.botActiveStatusPerRoom.get(roomName) !== false;
  }

  @SubscribeMessage('message-from-client')
  async handleMessage(client: Socket, payload: NewMessageDto) {
    const roomName = this.chatbotService.getClientRoom(client.id);

    if (!roomName) {
      console.error(`No room found for client ${client.id}`);
      return;
    }

    await this.chatbotService.saveChatMessage(
      roomName,
      client.id,
      payload.message,
    );

    let responseMessage = '';
    const currentState = this.chatbotService.getConversationState(client.id);

    switch (currentState) {
      case 'initialGreeting':
        responseMessage =
          'Para darte una atención más personalizada ¿Me podrías indicar tu nombre?';
        this.chatbotService.updateConversationState(client.id, 'awaitingName');
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
        } else {
          responseMessage =
            'Parece que no recibí un nombre válido. ¿Me podrías decir tu nombre, por favor?';
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
        } else {
          responseMessage =
            'Parece que el email no es válido. ¿Podrías indicarme tu email?';
        }
        break;
      case 'awaitingPhoneNumber':
        this.chatbotService.saveConversationData(client.id, {
          phoneNumber: payload.message,
        });
        responseMessage =
          'Gracias, hemos completado el registro. Nos pondremos en contacto contigo pronto.';
        this.chatbotService.updateConversationState(client.id, 'completed');
        this.chatbotService.saveConversationToDatabase(roomName);
        break;
      default:
        break;
    }

    const isAdmin = this.clientRoles.get(client.id) === 'admin';
    const senderName = isAdmin
      ? this.chatbotService.getUserFullName(client.id)
      : 'You';

    this.wss.to(roomName).emit('message-from-server', {
      FullName: senderName,
      Message: payload.message,
      RoomName: roomName,
      isAdmin: isAdmin,
    });

    if (this.isBotActiveForRoom(roomName) && responseMessage) {
      await this.chatbotService.saveChatMessage(
        roomName,
        'Fixy',
        responseMessage,
      );
      this.wss.to(roomName).emit('message-from-server', {
        FullName: 'Fixy',
        Message: responseMessage,
        RoomName: roomName,
        isAdmin: false,
      });
    }
  }
}
