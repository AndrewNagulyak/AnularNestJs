import { Conversation } from './conversation.interface';
import { User } from '../../auth/user.entity';

export interface Message {
  id?: number;
  message?: string;
  user?: User;
  conversation: Conversation;
  createdAt?: Date;
}
