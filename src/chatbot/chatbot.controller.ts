import { Controller, Get } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Get('connected-clients')
  getConnectedClients() {
    return this.chatbotService.getConnectedClientsForAPI();
  }
}
