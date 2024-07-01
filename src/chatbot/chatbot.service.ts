import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { LeadsService } from '../sales/leads/leads.service';
import { Status } from 'src/sales/leads/entities/lead.entity';
import { ProductType } from 'src/sales/leads/entities/lead.entity';
import { CreateLeadDto } from 'src/sales/leads/dto/create-lead.dto';
interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
    conversationState:
      | 'initialGreeting'
      | 'awaitingGreetingResponse'
      | 'awaitingName'
      | 'awaitingEmail'
      | 'awaitingPhoneNumber'
      | 'completed';
    conversationData: {
      name?: string;
      email?: string;
      phoneNumber?: string; // Added phoneNumber property
      message?: string;
    };
  };
}

@Injectable()
export class ChatbotService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly leadsService: LeadsService,
  ) {}

  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('user not found');
    }
    if (!user.isActive) {
      throw new Error('user is not active');
    }

    this.connectedClients[client.id] = {
      socket: client,
      user: user,
      conversationState: 'initialGreeting',
      conversationData: {},
    };
  }

  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    console.log(this.connectedClients);
    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.name;
  }

  getConversationState(clientId: string) {
    return this.connectedClients[clientId].conversationState;
  }

  updateConversationState(
    clientId: string,
    newState:
      | 'initialGreeting'
      | 'awaitingGreetingResponse'
      | 'awaitingName'
      | 'awaitingEmail'
      | 'awaitingPhoneNumber'
      | 'completed',
  ) {
    if (this.connectedClients[clientId]) {
      this.connectedClients[clientId].conversationState = newState;
    }
  }

  saveConversationData(
    clientId: string,
    data: {
      name?: string;
      email?: string;
      phoneNumber?: string;
      message?: string;
    },
  ) {
    if (this.connectedClients[clientId]) {
      this.connectedClients[clientId].conversationData = {
        ...this.connectedClients[clientId].conversationData,
        ...data,
      };
    }
  }

  async saveConversationToDatabase(clientId: string) {
    const clientData = this.connectedClients[clientId];
    if (clientData) {
      const leadData: CreateLeadDto = {
        client: clientData.conversationData.name,
        email: clientData.conversationData.email,
        phone: clientData.conversationData.phoneNumber,
        product_interested:
          clientData.conversationData.message || 'Default Product', // Provide a default value if null
        status: Status.PROSPECT,
        type_of_product: ProductType.CONSUMABLE,
        assigned: null,
      };

      await this.leadsService.create(leadData);
    }
  }
}
