import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { LessThan, Repository } from 'typeorm';
import { LeadsService } from '../sales/leads/leads.service';
import { Status } from 'src/sales/leads/entities/lead.entity';
import { ProductType } from 'src/sales/leads/entities/lead.entity';
import { CreateLeadDto } from 'src/sales/leads/dto/create-lead.dto';
import { v4 as uuidv4 } from 'uuid';
import { ChatHistory } from './chat-history/entities/chat-history.entity';
type ConversationState =
  | 'initialGreeting'
  | 'awaitingGreetingResponse'
  | 'awaitingFormCompletion'
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
    console.log('Registering client...', { userId, roomName, savedState });

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    if (!roomName) {
      roomName = `room_${uuidv4()}`;
    }

    let initialState: ConversationState = 'initialGreeting';
    let conversationData = {};

    // If we have a room name, try to retrieve the existing state and data
    if (roomName) {
      const existingClientData = Object.values(this.connectedClients).find(
        (client) => client.roomName === roomName,
      );

      if (existingClientData) {
        initialState = existingClientData.conversationState;
        conversationData = existingClientData.conversationData;
      } else {
        // If no existing client data, try to reconstruct from chat history
        const chatHistory = await this.getChatHistory(roomName);
        const reconstructedData = this.reconstructConversationData(chatHistory);
        initialState = reconstructedData.state;
        conversationData = reconstructedData.data;
      }
    }

    // Use savedState if it's provided and valid, otherwise use the reconstructed state
    if (savedState) {
      const validatedState = this.validateConversationState(savedState);
      if (validatedState !== 'initialGreeting') {
        initialState = validatedState;
      }
    }

    this.connectedClients[client.id] = {
      socket: client,
      user: user,
      conversationState: initialState,
      conversationData: conversationData,
      roomName: roomName,
    };

    console.log(
      `User registered: ${userId} in room: ${roomName} with state: ${initialState}`,
    );

    return roomName;
  }

  private reconstructConversationData(chatHistory: ChatHistory[]): {
    state: ConversationState;
    data: any;
  } {
    let state: ConversationState = 'initialGreeting';
    let data: any = {};

    for (const chat of chatHistory) {
      if (chat.senderId === 'Fixy') {
        if (chat.message.includes('nombre')) {
          state = 'awaitingName';
        } else if (chat.message.includes('email')) {
          state = 'awaitingEmail';
        } else if (chat.message.includes('teléfono')) {
          state = 'awaitingPhoneNumber';
        } else if (chat.message.includes('completado el registro')) {
          state = 'completed';
        }
      } else {
        switch (state) {
          case 'awaitingName':
            data.name = chat.message;
            break;
          case 'awaitingEmail':
            data.email = chat.message;
            break;
          case 'awaitingPhoneNumber':
            data.phoneNumber = chat.message;
            break;
        }
      }
    }

    return { state, data };
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

  getConversationState(clientId: string): ConversationState {
    return (this.connectedClients[clientId]?.conversationState ||
      'initialGreeting') as ConversationState;
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

    // Call the method to update chat history with the name
    if (data.name) {
      this.updateChatHistoryWithName(clientId);
    }
  }

  //create lead
  async saveConversationToDatabase(roomName: string) {
    const chatHistory = await this.getChatHistory(roomName);
    const leadData = this.extractLeadDataFromChatHistory(chatHistory);

    if (leadData) {
      const createLeadDto: CreateLeadDto = {
        client: leadData.name,
        email: leadData.email,
        phone: leadData.phoneNumber,
        product_interested: leadData.message || 'Default Product',
        status: Status.PROSPECT,
        type_of_product: ProductType.CONSUMABLE,
        assigned: null,
      };

      await this.leadsService.create(createLeadDto);
    }
  }

  private extractLeadDataFromChatHistory(chatHistory: ChatHistory[]): {
    name?: string;
    email?: string;
    phoneNumber?: string;
    message?: string;
  } | null {
    let name, email, phoneNumber, message;
    let expectingName = false,
      expectingEmail = false,
      expectingPhone = false;

    for (let i = 0; i < chatHistory.length; i++) {
      const currentMessage = chatHistory[i];
      const nextMessage = chatHistory[i + 1];

      if (currentMessage.senderId === 'Fixy') {
        // Assuming 'Fixy' is the bot's ID
        if (currentMessage.message.includes('nombre')) {
          expectingName = true;
        } else if (currentMessage.message.includes('email')) {
          expectingEmail = true;
        } else if (currentMessage.message.includes('teléfono')) {
          expectingPhone = true;
        }
      } else if (nextMessage && nextMessage.senderId !== 'Fixy') {
        if (expectingName && !name) {
          name = nextMessage.message.trim();
          expectingName = false;
        } else if (expectingEmail && !email) {
          email = nextMessage.message.trim();
          expectingEmail = false;
        } else if (expectingPhone && !phoneNumber) {
          phoneNumber = nextMessage.message.trim();
          expectingPhone = false;
        } else if (!message) {
          message = nextMessage.message.trim();
        }
      }
    }

    return name || email || phoneNumber
      ? { name, email, phoneNumber, message }
      : null;
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

    // Save the chat message
    await this.chatHistoryRepository.save(chatHistory);

    // Check if the message contains "User's name is"
    if (message.startsWith("User's name is ")) {
      const name = message.replace("User's name is ", '');
      console.log(`Extracted name: ${name}`);

      // Find the previous message from the same room
      const previousMessage = await this.chatHistoryRepository.findOne({
        where: {
          roomId: roomId,
        },
        order: {
          timestamp: 'DESC',
        },
      });

      if (previousMessage) {
        console.log(`Found previous message with ID: ${previousMessage.id}`);
        // Update the senderName of the previous message
        previousMessage.senderName = name;
        await this.chatHistoryRepository.save(previousMessage);
        console.log(`Updated senderName to: ${name}`);
      } else {
        console.log('No previous message found');
      }
    }
  }

  async updateChatHistoryWithName(clientId: string) {
    const client = this.connectedClients[clientId];
    if (!client) {
      throw new Error('Client not found');
    }

    const { name } = client.conversationData;
    if (name) {
      await this.saveChatMessage(
        client.roomName,
        client.user.id,
        `User's name is ${name}`,
      );
      console.log(
        `Updated chat history for room ${client.roomName} with name: ${name}`,
      );
    }
  }
}
