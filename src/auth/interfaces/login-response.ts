// login-response.interface.ts
import { UserResponse } from '../entities/user-response.interface';

export interface LoginResponse {
  user: UserResponse;
  token: string;
}
