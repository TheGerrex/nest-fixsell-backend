import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatHistory } from './entities/chat-history.entity'; // Assuming you have an entity defined for chat history
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';

@Injectable()
export class ChatHistoryService {
  constructor(
    @InjectRepository(ChatHistory)
    private chatHistoryRepository: Repository<ChatHistory>,
  ) {}

  async create(
    createChatHistoryDto: CreateChatHistoryDto,
  ): Promise<ChatHistory> {
    const newChatHistory =
      this.chatHistoryRepository.create(createChatHistoryDto);
    return this.chatHistoryRepository.save(newChatHistory);
  }

  async findAll(): Promise<ChatHistory[]> {
    return await this.chatHistoryRepository.find();
  }

  async findOne(roomId: string): Promise<ChatHistory[]> {
    return await this.chatHistoryRepository.find({ where: { roomId } });
  }

  async update(
    id: number,
    updateChatHistoryDto: UpdateChatHistoryDto,
  ): Promise<ChatHistory> {
    await this.chatHistoryRepository.update(id, updateChatHistoryDto);
    const updatedChatHistory = await this.chatHistoryRepository.findOne({
      where: { id },
    });
    if (!updatedChatHistory) {
      throw new NotFoundException(`ChatHistory with ID "${id}" not found`);
    }
    return updatedChatHistory;
  }

  async remove(id: number): Promise<void> {
    const result = await this.chatHistoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ChatHistory with ID "${id}" not found`);
    }
    return;
  }
}
