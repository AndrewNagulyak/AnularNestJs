import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from '../tasks/task.entity';
import { Card } from '../cards/card.entity';
import { Board } from '../boards/board.entity';
import { Role } from './dto/role';
import { FeedPostEntity } from '../feed/models/post.entity';
import { FriendRequestEntity } from './dto/friend-request.entity';
import { ConversationEntity } from '../chat/models/conversation.entity';
import { MessageEntity } from '../chat/models/message.entity';

@Entity({ name: 'User' })
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;
  @Column()
  email: string;
  @Column()
  displayName: string;
  @Column()
  password: string;
  @Column()
  salt: string;
  @Column()
  system: string;

  @Column({ nullable: true, default: () => '' })
  imagePath?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany((type) => Task, (task) => task.user, { eager: false })
  tasks: Task[];

  @OneToMany((type) => Task, (task) => task.user, { eager: false })
  cards: Card[];

  @OneToMany((type) => Task, (task) => task.user, { eager: false })
  boards: Board[];

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @OneToMany(() => FeedPostEntity, (feedPostEntity) => feedPostEntity.author)
  feedPosts: FeedPostEntity[];

  @OneToMany(
    () => FriendRequestEntity,
    (friendRequestEntity) => friendRequestEntity.creator,
  )
  sentFriendRequests: FriendRequestEntity[];

  @OneToMany(
    () => FriendRequestEntity,
    (friendRequestEntity) => friendRequestEntity.receiver,
  )
  receivedFriendRequests: FriendRequestEntity[];

  @ManyToMany(
    () => ConversationEntity,
    (conversationEntity) => conversationEntity.users,
  )
  conversations: ConversationEntity[];

  @OneToMany(() => MessageEntity, (messageEntity) => messageEntity.user)
  messages: MessageEntity[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
