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

interface ClientInfo {
  roomId: string;
  employeeInCharge: string | null;
}

@WebSocketGateway({ cors: true })
export class ChatbotGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  private clients = new Map<string, ClientInfo>();
  private employees = new Set<string>();
  server: Server;

  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    if (token) {
      let payload: JwtPayload;
      try {
        payload = this.jwtService.verify(token);
        const isEmployee = await this.chatbotService.checkIfEmployee(
          payload.id,
        );
        if (isEmployee) {
          const userRoles = await this.chatbotService.getUserRoles(payload.id);
          if (userRoles.includes('admin') || userRoles.includes('chat')) {
            console.log(`User ${payload.id} is an employee.`);
            this.handleEmployeeConnect(client, payload.id);
            return; // Ensure method exits here for employee connections
          } else {
            console.log(
              `User ${payload.id} does not have the required role to connect as an employee.`,
            );
            client.disconnect();
            return; // Ensure method exits here if roles are not valid
          }
        } else {
          console.log(`User ${payload.id} is not an employee.`);
          client.disconnect();
          return; // Ensure method exits here if not an employee
        }
      } catch (error) {
        console.error(`Token verification failed: ${error.message}`);
        client.disconnect();
        return; // Ensure method exits here if token verification fails
      }
    } else {
      // Handle as user connection if no token is provided
      const newRoomId = this.createRoomForUser(client);
      console.log(`User connected to room ${newRoomId}`);
      // No need for a return here since it's the last action
    }
  }
  async checkIfEmployee(userId: string): Promise<boolean> {
    // Now calling the method from ChatbotService
    return this.chatbotService.checkIfEmployee(userId);
  }

  async getUserRoles(userId: string): Promise<string[]> {
    // Implementation to get user roles
    // This method should be implemented in your ChatbotService or a similar service
    return this.chatbotService.getUserRoles(userId);
  }

  createRoomForUser(client: Socket): string {
    const roomId = this.generateUniqueRoomId();
    client.join(roomId);
    this.clients.set(client.id, { roomId, employeeInCharge: null });
    console.log('Client connected', client.id, 'to room', roomId);
    return roomId;
  }

  generateUniqueRoomId(): string {
    // Implement a method to generate a unique room ID
    return `room_${Math.random().toString(36).substring(2, 15)}`;
  }

  handleDisconnect(client: Socket) {
    // console.log('Client disconnected', client.id);
    this.chatbotService.removeClient(client.id);
    this.wss.emit('clients-updated', this.chatbotService.getConnectedClients());
  }

  // message-from-client
  @SubscribeMessage('message-from-client')
  async handleMessage(client: Socket, payload: NewMessageDto) {
    const state = this.chatbotService.getConversationState(client.id);

    let responseMessage = '';

    switch (state) {
      case 'initialGreeting':
        // Immediately ask for the user's name after the initial greeting.
        responseMessage =
          'Para darte una atención más personalizada ¿Me podrías indicar tu nombre?';
        this.chatbotService.updateConversationState(client.id, 'awaitingName');
        break;
      case 'awaitingGreetingResponse':
        // This case may no longer be necessary if we handle the name prompt in 'initialGreeting'.
        // Consider removing or adjusting this case based on your specific flow.
        break;
      case 'awaitingName':
        // Assuming any response is valid for the name.
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
        // Simple validation for email.
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
        // Proceed with the original logic as phone number validation can be complex and is not covered here.
        this.chatbotService.saveConversationData(client.id, {
          phoneNumber: payload.message,
        });
        responseMessage =
          'Gracias, hemos completado el registro. Nos pondremos en contacto contigo pronto.';
        this.chatbotService.updateConversationState(client.id, 'completed');
        this.chatbotService.saveConversationToDatabase(client.id);
        break;
      default:
        // Handle other states or default message.
        break;
    }

    // Emit the user's message back to the user for display
    client.emit('message-from-server', {
      FullName: 'You',
      Message: payload.message,
    });

    // Emit the bot's response to the user
    if (responseMessage) {
      client.emit('message-from-server', {
        FullName: 'Fixi',
        Message: responseMessage,
      });
    }
  }

  // handle when a client connects
  @SubscribeMessage('connect-client')
  async handleClientConnect(client: Socket) {
    console.log('Client connected', client.id);
    // Assuming registerClient and updateConversationState do not require authentication
    await this.chatbotService.registerClient(client); // Pass null or a default value since there's no token

    // Emit greeting message
    this.chatbotService.updateConversationState(client.id, 'initialGreeting');
    client.emit('message-from-server', {
      FullName: 'Fixi',
      Message:
        '¡Hola! Bienvenido al chat de soporte. ¿Cómo puedo ayudarte hoy?',
    });

    // Notify all connected clients (you might need to adjust this based on your actual implementation)
    this.wss.emit('clients-updated', this.chatbotService.getConnectedClients());
  }

  @SubscribeMessage('connect-employee')
  handleEmployeeConnect(client: Socket, data: any) {
    console.log(`Received data for employee connect:`, data);

    // Assuming data might be an object containing employeeId and roomId
    // const employeeId = typeof data === 'object' ? data.employeeId : data;
    const roomId = typeof data === 'object' ? data.roomId : undefined;

    // if (!employeeId || !roomId) {
    //   console.log(
    //     `Employee ${
    //       employeeId || 'undefined'
    //     } failed to connect due to missing employeeId or roomId`,
    //   );
    //   return;
    // }

    this.employees.add(client.id);
    client.join(roomId);
    console.log(`User with role:  connected to room ${roomId}`);
  }

  // handle takeover of bot
  @SubscribeMessage('takeover-conversation')
  handleTakeover(client: Socket, { clientId }: { clientId: string }) {
    if (this.employees.has(client.id) && this.clients.has(clientId)) {
      this.clients.get(clientId).employeeInCharge = client.id;
      // Notify the employee and the client about the takeover
      client.emit('takeover-success', { clientId });
      this.server.to(clientId).emit('conversation-taken-over');
    }
  }

  @SubscribeMessage('message-from-employee')
  handleMessageFromEmployee(
    client: Socket,
    { clientId, message }: { clientId: string; message: string },
  ) {
    if (this.employees.has(client.id) && this.clients.has(clientId)) {
      // Send message from employee to client
      this.server.to(clientId).emit('message-from-server', {
        FullName: 'Employee',
        Message: message,
      });
    }
  }
}
