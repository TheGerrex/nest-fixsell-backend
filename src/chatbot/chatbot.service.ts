import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { LeadsService } from '../sales/leads/leads.service';
import { Status } from 'src/sales/leads/entities/lead.entity';
import { ProductType } from 'src/sales/leads/entities/lead.entity';
import { CreateLeadDto } from 'src/sales/leads/dto/create-lead.dto';
import { v4 as uuidv4 } from 'uuid';
import { ChatHistory } from './chat-history/entities/chat-history.entity';
type ConversationState =
  | 'initialGreeting'
  | 'awaitingGreetingResponse'
  | 'awaitingName'
  | 'awaitingEmail'
  | 'awaitingPhoneNumber'
  | 'completed'
  | 'adminConnected';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
    roomName: string;
    conversationState: ConversationState;
    conversationData: {
      name?: string;
      email?: string;
      phoneNumber?: string;
      message?: string;
    };
  };
}

@Injectable()
export class ChatbotService {
  private connectedClients: ConnectedClients = {};
  private clientRooms: Map<string, string>;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly leadsService: LeadsService,
    @InjectRepository(ChatHistory)
    private readonly chatHistoryRepository: Repository<ChatHistory>, // Add the type annotation for chatHistoryRepository
  ) {
    this.clientRooms = new Map();
  }

  async registerUser(
    client: Socket,
    userId: string,
    roomName?: string,
    savedState?: string,
  ): Promise<string> {
    console.log('registering client...');
    if (!roomName) {
      roomName = `room_${uuidv4()}`;
    }
    console.log('Room name for registering user:', roomName);
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('user not found');
    }
    if (!user.isActive) {
      throw new Error('user is not active');
    }

    const initialState = this.validateConversationState(savedState);

    // Check if the client is already registered
    if (this.connectedClients[client.id]) {
      console.log(
        `Client ${client.id} already registered, updating room name and state.`,
      );
      this.connectedClients[client.id].roomName = roomName;
      this.connectedClients[client.id].conversationState = initialState;
    } else {
      this.connectedClients[client.id] = {
        socket: client,
        user: user,
        conversationState: initialState,
        conversationData: {},
        roomName: roomName,
      };
      console.log(`User registered: ${userId} in room: ${roomName}`);
    }

    // Skip the initial message if the state is not initialGreeting
    if (initialState === 'initialGreeting') {
      // await this.saveChatMessage(
      //   roomName,
      //   'Fixy',
      //   '¡Hola! 👋 Estoy aquí para ayudarte en lo que necesites.',
      // );
      client.emit('message-from-server', {
        FullName: 'Fixy',
        Message: '¡Hola! 👋 Estoy aquí para ayudarte en lo que necesites.',
        RoomName: roomName,
      });
    }

    return roomName;
  }
  private validateConversationState(state?: string): ConversationState {
    const validStates: ConversationState[] = [
      'initialGreeting',
      'awaitingGreetingResponse',
      'awaitingName',
      'awaitingEmail',
      'awaitingPhoneNumber',
      'completed',
      'adminConnected',
    ];

    if (state && validStates.includes(state as ConversationState)) {
      return state as ConversationState;
    }

    return 'initialGreeting';
  }

  async registerAdmin(client: Socket, userId: string, roomName: string) {
    console.log('registering admin...');
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('admin not found');
    }
    if (!user.isActive) {
      throw new Error('admin is not active');
    }
    this.connectedClients[client.id] = {
      socket: client,
      user: user,
      conversationState: 'adminConnected',
      conversationData: {},
      roomName: roomName, // Ensure the correct room name is used
    };

    //get chat history for the room
    const chatHistory = await this.getChatHistory(roomName);
    console.log('Chat history for room:', chatHistory); // Debugging log
    client.emit('chatHistory', chatHistory);
    console.log('Registering admin to room:', roomName); // Debugging log
  }

  getClientRoom(clientId: string): string | undefined {
    console.log('Getting room for client:', clientId);
    return this.connectedClients[clientId]?.roomName;
  }
  removeClient(clientId: string) {
    console.log(`Removing client: ${clientId}`);
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): { id: string; roomName: string }[] {
    return Object.entries(this.connectedClients).map(([id, client]) => ({
      id,
      roomName: client.roomName,
    }));
  }

  getConnectedClientsForAPI(): { id: string; roomName: string }[] {
    console.log('Current connected clients:', this.connectedClients);
    return Object.entries(this.connectedClients)
      .filter(([_, client]) => client.conversationState !== 'completed')
      .map(([id, client]) => ({
        id,
        roomName: client.roomName,
      }));
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.name;
  }

  getConversationState(clientId: string): string {
    return (
      this.connectedClients[clientId]?.conversationState || 'initialGreeting'
    );
  }

  async getChatHistory(roomId: string): Promise<ChatHistory[]> {
    return await this.chatHistoryRepository.find({
      where: { roomId: roomId },
      order: { timestamp: 'ASC' },
    });
  }

  updateConversationState(clientId: string, newState: ConversationState) {
    if (this.connectedClients[clientId]) {
      this.connectedClients[clientId].conversationState = newState;
      console.log(`Updated state for client ${clientId} to ${newState}`);

      // Emit the new state to the client
      this.connectedClients[clientId].socket.emit('chatState', newState);
    }
  }
  //for lead
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
  //create lead
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

  async saveChatMessage(
    roomId: string,
    senderId: string,
    message: string,
  ): Promise<void> {
    const chatHistory = new ChatHistory();
    chatHistory.roomId = roomId;
    chatHistory.senderId = senderId;
    chatHistory.message = message;
    chatHistory.timestamp = new Date(); // Set the current timestamp

    // Assuming you have a chatHistoryRepository injected in ChatbotService
    await this.chatHistoryRepository.save(chatHistory);
  }
}
