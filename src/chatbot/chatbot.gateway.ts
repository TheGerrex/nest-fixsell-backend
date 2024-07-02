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
    const token = client.handshake.headers.authentication as string;
    console.log('socket received token:', { token });
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.chatbotService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    // Create or join a room named after the user's ID
    const roomName = `room_${payload.id}`; // Using user's ID from payload to create a room
    client.join(roomName);

    // Notify the client about the room they're in
    client.emit('room-joined', roomName);

    // Emit greeting message to the room
    this.wss.to(roomName).emit('message-from-server', {
      FullName: 'Fixi',
      Message:
        '¡Hola! Bienvenido al chat de soporte. ¿Cómo puedo ayudarte hoy?',
    });

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
    const roomName = `room_${this.chatbotService.getClientRoom(client.id)}`;
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

    // Emit the user's message back to the user for display, but now to the room
    client.to(roomName).emit('message-from-server', {
      FullName: 'You',
      Message: payload.message,
    });
    console.log(
      `[handleMessage] User's message emitted back to room: ${roomName}`,
    );

    // Emit the bot's response to the user, also to the room
    if (responseMessage) {
      client.to(roomName).emit('message-from-server', {
        FullName: 'Fixi',
        Message: responseMessage,
      });
      console.log(
        `[handleMessage] Bot's response emitted to room: ${roomName}`,
      );
    } else {
      console.log(
        `[handleMessage] No response message generated for client ${client.id}`,
      );
    }
  }
}
