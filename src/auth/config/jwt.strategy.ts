import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt'
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserRepository} from '../user.repository';
import {JwtPayloadInterface} from '../jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
 constructor(@InjectRepository(UserRepository)
						 private userRepository: UserRepository) {
	super({
	 jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	 secretOrKey: 'topSeret61',
	});
 }

 async validate(payload: JwtPayloadInterface) {
	const user = await this.userRepository.findOne({username:	 payload.username})
	if (!user) {
	 throw new UnauthorizedException();
	}
	return user;
 }
}