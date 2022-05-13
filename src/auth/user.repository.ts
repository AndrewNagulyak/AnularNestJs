import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/users-get.dto';
import { AuthGoogleCredentialDto } from './dto/auth-google-credential.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUsers(): Promise<UserDto[]> {
    const query = this.createQueryBuilder('user');
    const users = await query
      .select('user.email')
      .addSelect('user.id')
      .getMany();
    return users;
  }

  async singUpGoogle(authCredDto: AuthGoogleCredentialDto): Promise<void> {
    const { displayName, email, userId } = authCredDto;
    const user = new User();
    user.email = email;
    user.displayName = displayName;
    user.password = userId;
    user.imagePath = '';
    user.system = 'google';
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(userId, user.salt);
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        //duplicate login
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { email, displayName, password } = authCredentialDto;
    const user = new User();
    user.email = email;
    user.displayName = displayName;
    user.system = '';
    user.imagePath = '';
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        //duplicate login
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async logout() {}

  async validateGoogleUser(
    authCredsDto: AuthGoogleCredentialDto,
  ): Promise<string> {
    const { email } = authCredsDto;
    const user = await this.findOne({ email, system: 'google' });
    return user ? user.email : '';
  }

  async validateUserPassword(
    authCredentialsDTO: AuthCredentialDto,
  ): Promise<string> {
    const { email, password } = authCredentialsDTO;
    const user = await this.findOne({ email, system: '' });
    if (user && (await user.validatePassword(password))) {
      return user.email;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
