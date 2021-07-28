import {IsString, Matches, MaxLength, MinLength} from 'class-validator';

export class AuthCredentialDto {
 @IsString()
 @MinLength(4)
 @MaxLength(20)

 username: string;
 @IsString()
 @MinLength(8)
 @MaxLength(20)
 @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, {message: 'Password too week'})
 password: string;
}