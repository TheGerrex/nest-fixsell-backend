import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';
import { UpdateChatHistoryDto } from './dto/update-chat-history.dto';

@Controller('chat-history')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) { }

  @Post()
  create(@Body() createChatHistoryDto: CreateChatHistoryDto) {
    return this.chatHistoryService.create(createChatHistoryDto);
  }

  @Get()
  findAll() {
    return this.chatHistoryService.findAll();
  }

  @Get('room/:id')
  findOneByRoomId(@Param('id') id: string) {
    return this.chatHistoryService.findOneByRoomId(id);
  }

  @Get('message/:id')
  findOneById(@Param('id') id: string) {
    return this.chatHistoryService.findOneById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatHistoryDto: UpdateChatHistoryDto,
  ) {
    return this.chatHistoryService.update(+id, updateChatHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatHistoryService.remove(+id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.chatHistoryService.markAsRead(+id);
  }
}
