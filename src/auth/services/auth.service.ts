import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { AuthCredentialDto } from '../dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from '../jwt-payload.interface';
import { UserDto } from '../dto/users-get.dto';
import { AuthGoogleCredentialDto } from '../dto/auth-google-credential.dto';
import { User } from '../user.entity';
import { Profile } from '../dto/profile';
import { catchError, from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  signUp(authCreds: AuthCredentialDto): Observable<any> {
    return from(this.userRepository.signUp(authCreds));
  }

  async contact(): Promise<UserDto[]> {
    return this.userRepository.getUsers();
  }

  getUserById(id: string): Observable<User> {
    return from(this.userRepository.findOne({ id }));
  }

  getJwtUserEmail(jwt: string): Observable<User> {
    return from(
      this.jwtService.verifyAsync(jwt).then((data) => {
        return this.userRepository.findOne({ email: data.email });
      }),
    );
  }

  getProfile(id: string): Observable<Profile> {
    return from(this.userRepository.findOne({ id: id })).pipe(
      map((user) => {
        return {
          displayName: user.displayName,
          email: user.email,
          id: user.id,
          imagePath: user.imagePath,
        };
      }),
    );
  }

  async signInGoogle(
    authCreds: AuthGoogleCredentialDto,
  ): Promise<{ accessToken: string; user: { email: string } }> {
    const email = await this.userRepository.validateGoogleUser(authCreds);
    if (!email) {
      await this.userRepository.singUpGoogle(authCreds);
    }

    const accessToken = this.jwtService.sign({ email: authCreds.email });

    return { accessToken, user: { email: authCreds.email } };
  }

  async signIn(
    authCreds: AuthCredentialDto,
  ): Promise<{ accessToken: string; user: { email: string } }> {
    const email = await this.userRepository.validateUserPassword(authCreds);
    if (!email) {
      throw new UnauthorizedException('Innvalid credantials');
    }
    const payload: JwtPayloadInterface = { email };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user: { email: email } };
  }
}
