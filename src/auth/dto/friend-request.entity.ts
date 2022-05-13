import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { FriendRequest_Status } from './friend-request.interface';
import { User } from '../user.entity';

@Entity('request')
export class FriendRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (userEntity) => userEntity.sentFriendRequests)
  creator: User;

  @ManyToOne(() => User, (userEntity) => userEntity.receivedFriendRequests)
  receiver: User;

  @Column()
  status: FriendRequest_Status;
}
