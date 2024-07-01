import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotGateway } from './chatbot.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { LeadsModule } from 'src/sales/leads/leads.module';
// import user

@Module({
  providers: [ChatbotGateway, ChatbotService],
  imports: [AuthModule, LeadsModule], // Add LeadsModule to imports
})
export class ChatbotModule {}
