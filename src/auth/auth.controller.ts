import {Body, Controller, Get, Post, UseGuards, ValidationPipe} from '@nestjs/common';
import {AuthCredentialDto} from './dto/auth-credential.dto';
import {AuthService} from './auth.service';
import {AuthGuard} from '@nestjs/passport';
import {GetUser} from './decorators/get-user.decorator';
import {User} from './user.entity';

@Controller('auth')
export class AuthController {
 constructor(private authServie: AuthService) {
 }

 @Post('/signup')
 signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialDto) {
	return this.authServie.signUp(authCredentialsDto);
 }

 @Get('/contacts')
 contact() {
	return this.authServie.contact();
 }


 @Post('/signin')
 signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialDto): Promise<{ accessToken: string }> {
	return this.authServie.signIn(authCredentialsDto);
 }

 @Post('/test')
 @UseGuards(AuthGuard())
 test(@GetUser() user: User) {
	console.log(user);
 }
}
