import {BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {User} from '../auth/user.entity';
import {Task} from '../tasks/task.entity';
import {Card} from '../cards/card.entity';

@Entity()
export class Board extends BaseEntity {
 @PrimaryGeneratedColumn()
 id: number;
 @Column({nullable: true})
 imgUrl: string;
 @Column()
 title: string;
 @Column({default: true})
 createdDate: string = new Date().toISOString();
 @Column({nullable: true})
 color: string;
 @OneToMany(type => Card, card=> card.board, {eager: true})
 cards: Card[]
 @Column({default: true})
 modifiedDate: string = new Date().toISOString();
 @Column({default: true})
 viewedDate: string = new Date().toISOString();
 @ManyToOne(type => User, user => user.boards, {eager: false})
 user: User;
 @Column()
 userId: string;
}
