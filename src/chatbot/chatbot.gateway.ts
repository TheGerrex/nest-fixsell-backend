import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ChatbotService } from './chatbot.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatbotGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatbotService: ChatbotService) {}

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }
}
