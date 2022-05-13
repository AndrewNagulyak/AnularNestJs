import { User } from '../../auth/user.entity';

export interface Conversation {
  id?: number;
  users?: User[];
  lastUpdated?: Date;
}
