import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthGoogleCredentialDto {
  @IsString()
  userId: string;
  @IsString()
  email: string;
  @IsString()
  displayName: string;
}
