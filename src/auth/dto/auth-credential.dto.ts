import {
  IsBoolean,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  email: string;
  displayName: string;
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  // @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, {
  //   message: 'Password too week',
  // })
  password: string;
}
