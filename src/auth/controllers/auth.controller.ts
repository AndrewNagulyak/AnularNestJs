import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentialDto } from '../dto/auth-credential.dto';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorators/get-user.decorator';
import { User } from '../user.entity';
import { Observable } from 'rxjs';
import { Profile } from '../dto/profile';

@Controller('auth')
export class AuthController {
  constructor(private authServie: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialDto) {
    return this.authServie.signUp(authCredentialsDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    if (req.user.accessToken)
      res.redirect(
        'http://localhost:4200/authorization/login?success=true' +
          `&token=${req.user.accessToken}` +
          `&displayName=${req.user.displayName}` +
          `&email=${req.user.email}`,
      );
    else res.redirect('http://localhost:4200/login/failure');
  }

  @Get('/contacts')
  contact() {
    return this.authServie.contact();
  }

  @Get('/getProfile')
  @UseGuards(AuthGuard())
  getProfile(
    @GetUser() user: User,
    @Query('userId') userId,
  ): Observable<Profile> {
    return this.authServie.getProfile(userId ? userId : user.id);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.authServie.signIn(authCredentialsDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {}
}
