import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {TaskStatus} from './task-status.enum';
import {User} from '../auth/user.entity';
import {Card} from '../cards/card.entity';

@Entity()
export class Task extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;

 @Column()
 title: string;

 @Column()
 description: string;

 @Column()
 status: TaskStatus;

 @ManyToOne(type => User, user => user.tasks, {eager: false})
 user: User;

 @ManyToOne(type => Card, card => card.tasks, {eager: false})
 card: User;

 @Column()
 cardId: number;

 @Column()
 userId: string;
}
