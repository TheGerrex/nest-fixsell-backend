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
// import { v4 as uuidv4 } from 'uuid';
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
    // if (!token || !role) {
    //   console.error('Missing authentication or role information');
    //   client.disconnect();
    //   return;
    // }

    try {
      if (role === 'admin') {
        // Verify token only for admin
        const payload = this.jwtService.verify(token);
        await this.handleAdminConnection(client, payload);
      } else if (role === 'user') {
        // Directly handle user connection without token verification
        await this.handleUserConnection(client, {});
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
    // Register user and automatically generate and assign a room name
    await this.chatbotService.registerUser(client, payload.id);

    // Retrieve the assigned room name from the connectedClients map
    const roomName = this.chatbotService.getClientRoom(client.id);
    if (!roomName) {
      console.error('Failed to retrieve room name for user connection.');
      return;
    }

    // Join the generated room
    client.join(roomName);
    console.log('User emitting room-joined with name:', roomName);
    client.emit('room-joined', roomName);

    // Emit user joined message to the room
    this.wss.to(roomName).emit('user-joined', {
      FullName: 'User',
      Message: 'A user has joined the room.',
      RoomName: roomName,
    });

    // First, save the greeting message to chat history
    await this.chatbotService.saveChatMessage(
      roomName,
      'Fixy', // Assuming 'Fixi' is the sender name for the bot
      '¡Hola! 👋 Estoy aquí para ayudarte en lo que necesites.',
    );

    // Emit greeting message to the correctly named room
    this.wss.to(roomName).emit('message-from-server', {
      FullName: 'Fixy',
      Message: '¡Hola! 👋 Estoy aquí para ayudarte en lo que necesites.',
      RoomName: roomName,
    });
    console.log(`Emitting from server the initial greeting to ${roomName}`);

    // Update clients list (if necessary)
    this.wss.emit('clients-updated', this.chatbotService.getConnectedClients());
  }

  // Example of how to check if the bot is active for a specific room before sending a message
  isBotActiveForRoom(roomName: string): boolean {
    // If there's no specific entry for the room, assume the bot is active
    return this.botActiveStatusPerRoom.get(roomName) !== false;
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

    // Save the client's message to chat history
    await this.chatbotService.saveChatMessage(
      roomName,
      client.id,
      payload.message,
    );

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

    const adminName = this.chatbotService.getUserFullName(client.id);
    // Determine if the message is from an admin and emit with appropriate user name
    if (this.clientRoles.get(client.id) === 'admin') {
      this.wss.to(roomName).emit('message-from-server', {
        FullName: adminName,
        Message: payload.message,
        RoomName: roomName,
      });
    } else {
      // Correct way to emit to the room for non-admin users
      this.wss.to(roomName).emit('message-from-server', {
        FullName: 'You',
        Message: payload.message,
        RoomName: roomName, // Include the room name in the payload
      });
    }

    // Log the emission
    console.log(
      `[handleMessage] Event 'message-from-server' emitted to room: ${roomName} with payload: `,
      {
        FullName: 'You',
        Message: payload.message,
        RoomName: roomName,
      },
    );

    // Assuming roomName is defined in this context and contains the name of the current room

    // Check if the bot is active for the specific room before sending the bot's response
    if (this.isBotActiveForRoom(roomName) && responseMessage) {
      // Save the bot's response to chat history before emitting
      await this.chatbotService.saveChatMessage(
        roomName,
        'fixy',
        responseMessage,
      );
      // Emit the bot's response to the room
      this.wss.to(roomName).emit('message-from-server', {
        FullName: 'fixy',
        Message: responseMessage,
        RoomName: roomName,
      });
    }

    console.log(
      `[handleMessage] Bot's response emitted to room: ${roomName} with message: ${responseMessage}`,
    );
  }
}
