import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatbotService {
  afterInit(server: any) {
    throw new Error('Method not implemented.');
  }
}
