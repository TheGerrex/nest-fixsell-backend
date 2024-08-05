import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistoryController } from './chat-history.controller';
import { ChatHistory } from './entities/chat-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatHistory])], // Import TypeOrmModule with ChatHistory entity
  controllers: [ChatHistoryController],
  providers: [ChatHistoryService],
  exports: [TypeOrmModule], // Optionally export TypeOrmModule for re-use
})
export class ChatHistoryModule {}
