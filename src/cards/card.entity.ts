import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Task} from '../tasks/task.entity';
import {User} from '../auth/user.entity';
import {Board} from '../boards/board.entity';

@Entity()
export class Card extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;

 @Column()
 title: string;

 @OneToMany(type => Task, task => task.card, {eager: true})
 tasks: Task[]

 @ManyToOne(type => User, user => user.cards, {eager: false})
 user: User;


 @ManyToOne(type => Board, board => board.cards, {eager: false})
 board: Board;

 @Column()
 boardId: number;

 @Column()
 userId: string;
}
