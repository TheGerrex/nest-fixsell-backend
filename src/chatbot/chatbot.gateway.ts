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
  // bot boolean
  private clientRoles = new Map<string, string>();
  private botActiveStatusPerRoom: Map<string, boolean> = new Map();
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
        // Verify token only for admin
        const payload = this.jwtService.verify(token);
        await this.handleAdminConnection(client, payload);
      } else if (role === 'user') {
        // Pass the entire auth object as payload for user connection
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
    this.chatbotService.removeClient(client.id);
    this.wss.emit(
      'clients-updated',
      this.chatbotService.getConnectedClientsForAPI(),
    );

    // Check if the client is an admin
    if (this.clientRoles.get(client.id) === 'admin') {
      // If the client is an admin, call the admin-specific disconnect handler
      console.log('calling handleAdminDisconnect');
      this.handleAdminDisconnect(client);
    } else {
      // Proceed with the usual disconnect logic for non-admin clients
      this.chatbotService.removeClient(client.id);
      this.wss.emit(
        'clients-updated',
        this.chatbotService.getConnectedClients(),
      );
    }
  }

  async handleAdminConnection(client: Socket, payload: any) {
    console.log('connecting as admin...');
    console.log('Payload received:', payload);
    console.log('client handshake:', client.handshake.auth);

    const roomName = client.handshake.auth.roomName; // Use the roomName from client.handshake.auth
    // Set bot to inactive for the specific room
    this.botActiveStatusPerRoom.set(roomName, false);
    // Register admin from token
    try {
      await this.chatbotService.registerAdmin(client, payload.id, roomName);
      console.log('Admin registered with ID:', payload.id);
    } catch (error) {
      console.error('Failed to register admin:', error);
      client.disconnect();
      return;
    }

    // Retrieve admin name after successful registration
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
      'Fixy', // Assuming 'Fixi' is the sender name for the bot
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
    // Sets bot to true to resume bot activities

    const roomName = this.chatbotService.getClientRoom(client.id);
    if (!roomName) {
      console.error('Failed to retrieve room name for admin:', client.id);
      return;
    }

    // Sets bot to true to resume bot activities for the specific room
    this.botActiveStatusPerRoom.set(roomName, true);
    // Retrieve admin name after successful registration
    const adminName = this.chatbotService.getUserFullName(client.id);
    if (!adminName) {
      console.error('Failed to retrieve admin name');
      client.disconnect();
      return;
    }

    // Remove admin from the connected clients list
    this.chatbotService.removeClient(client.id);
    this.wss.emit('clients-updated', this.chatbotService.getConnectedClients());

    this.chatbotService.saveChatMessage(
      roomName,
      'Fixy', // Assuming 'Fixi' is the sender name for the bot
      `${adminName} ha abandonado la conversación. El bot ha retomado la conversación.`,
    );
    // Emit message to the room that admin has left
    this.wss.to(roomName).emit('message-from-server', {
      FullName: 'Fixy',
      Message: `${adminName} ha abandonado la conversación. El bot ha retomado la conversación.`,
      RoomName: roomName,
    });

    console.log(`Bot has resumed operations in room: ${roomName}`);
  }

  async handleUserConnection(client: Socket, payload: any) {
    console.log('connecting as user...');

    let roomName = payload.roomName; // Assume the roomName is sent in the payload
    const savedState = payload.savedState; // Retrieve saved state from payload
    console.log('Payload received for user...:', payload);

    if (roomName) {
      console.log(`Connecting to existing room: ${roomName}`);
      // Retrieve and send chat history for existing room
      const chatHistory = await this.chatbotService.getChatHistory(roomName);
      client.emit('chatHistory', chatHistory);
    } else {
      // Register user and automatically generate and assign a room name if not provided
      roomName = await this.chatbotService.registerUser(client, payload.id);
    }

    await this.chatbotService.registerUser(
      client,
      payload.id,
      roomName,
      savedState,
    );

    // Join the generated or existing room
    client.join(roomName);
    console.log('User emitting room-joined with name:', roomName);
    client.emit('room-joined', roomName);

    // Emit user joined message to the room
    this.wss.to(roomName).emit('user-joined', {
      FullName: 'User',
      Message: 'A user has joined the room.',
      RoomName: roomName,
    });

    // Emit initial chat state if available
    if (savedState) {
      client.emit('chatState', savedState);
    } else {
      // Emit initial greeting if no saved state
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

    // Update clients list (if necessary)
    this.wss.emit('clients-updated', this.chatbotService.getConnectedClients());
  }

  // Example of how to check if the bot is active for a specific room before sending a message
  isBotActiveForRoom(roomName: string): boolean {
    // If there's no specific entry for the room, assume the bot is active
    return this.botActiveStatusPerRoom.get(roomName) !== false;
  }

  @SubscribeMessage('message-from-client')
  async handleMessage(client: Socket, payload: NewMessageDto) {
    const roomName = this.chatbotService.getClientRoom(client.id);

    if (!roomName) {
      console.error(`No room found for client ${client.id}`);
      return;
    }

    // Save the client's message to chat history
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

    // Emit the message to the room with role information
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
