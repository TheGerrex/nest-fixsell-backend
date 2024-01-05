// user-response.interface.ts
import { User } from './user.entity';

export type UserResponse = Omit<User, 'password'>;
