import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserRepository} from './user.repository';
import {AuthCredentialDto} from './dto/auth-credential.dto';
import {JwtService} from '@nestjs/jwt';
import {JwtPayloadInterface} from './jwt-payload.interface';
import {User} from './user.entity';
import {UserDto} from './dto/users-get.dto';

@Injectable()
export class AuthService {

 constructor(
	@Inject(UserRepository)
	private userRepository: UserRepository,
	private jwtService: JwtService) {

 }

 async signUp(authCreds: AuthCredentialDto): Promise<void> {
	return this.userRepository.signUp(authCreds);
 }
 async contact():Promise<UserDto[]> {
  return this.userRepository.getUsers();
 }

 async signIn(authCreds: AuthCredentialDto): Promise<{ accessToken: string, user: { username: string } }> {
	const username = await this.userRepository.validateUserPassword(authCreds);
	if (!username) {
	 throw new UnauthorizedException('Innvalid credantials');
	}
	const payload: JwtPayloadInterface = {username};
	const accessToken = await this.jwtService.sign(payload);
	return {accessToken, user: {username: username}};

 }

}
