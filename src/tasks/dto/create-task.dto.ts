import {IsNotEmpty} from 'class-validator';

export class CreateTaskDto {
		@IsNotEmpty()
		title: string;
		cardId: number;
		// @IsNotEmpty()
		description: string;
}