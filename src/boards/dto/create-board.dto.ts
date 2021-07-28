import {IsNotEmpty} from 'class-validator';

export class CreateBoardDto {
 @IsNotEmpty()
 title: string;
 imgUrl?: string;
 color?: string;


}
