import {BaseEntity, Column, Entity, Generated, OneToMany, PrimaryColumn, Unique} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {Task} from '../tasks/task.entity';
import {Card} from '../cards/card.entity';
import {Board} from '../boards/board.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
 @PrimaryColumn({type: 'uuid'})
 @Generated('uuid') id: string;

 @Column()
 username: string;
 @Column()
 password: string;
 @Column()
 salt: string;

 @OneToMany(type => Task, task => task.user, {eager: true})
 tasks: Task[]

 @OneToMany(type => Task, task => task.user, {eager: true})
 cards: Card[]

 @OneToMany(type => Task, task => task.user, {eager: true})
 boards: Board[]

 async validatePassword(password: string): Promise<boolean> {
	const hash = await bcrypt.hash(password, this.salt);
	return hash === this.password;
 }
}
