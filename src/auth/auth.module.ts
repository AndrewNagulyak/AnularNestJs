import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './config/jwt.strategy';
import { GoogleStrategy } from './config/google.strategy';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { FriendRequestEntity } from './dto/friend-request.entity';
import { User } from './user.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([UserRepository, FriendRequestEntity]),
    JwtModule.register({
      secret: 'topSeret61',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],

  controllers: [AuthController, UserController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, UserService],
  exports: [JwtStrategy, PassportModule, AuthService, UserService],
})
export class AuthModule {}
