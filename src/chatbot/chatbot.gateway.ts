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

    // Emit greeting message
    this.chatbotService.updateConversationState(client.id, 'initialGreeting');
    client.emit('message-from-server', {
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
}
