import {EntityRepository, Repository} from 'typeorm';
import {User} from './user.entity';
import {AuthCredentialDto} from './dto/auth-credential.dto';
import {ConflictException, InternalServerErrorException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {UserDto} from './dto/users-get.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {


 async getUsers(): Promise<UserDto[]> {
	const query = this.createQueryBuilder('user');
	const users = await query.select('user.username').addSelect('user.id').getMany();
	console.log(users);
	return users;

 }

 async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
	const {username, password} = authCredentialDto;
	const user = new User();
	user.username = username;
	user.salt = await bcrypt.genSalt();
	user.password = await this.hashPassword(password, user.salt);
	try {
	 await user.save();
	} catch (error) {
	 console.log(error);
	 if (error.code === '23505') { //duplicate username
		throw new ConflictException('Username already exist');
	 } else {
		throw new InternalServerErrorException();
	 }
	}
 }

 async logout() {

 }

 async validateUserPassword(authCredentialsDTO: AuthCredentialDto): Promise<string> {
	const {username, password} = authCredentialsDTO;
	const user = await this.findOne({username});
	if (user && await user.validatePassword(password)) {
	 return user.username;
	} else {
	 return null;
	}

 }

 private async hashPassword(password: string, salt: string): Promise<string> {
	return bcrypt.hash(password, salt);
 }

}
