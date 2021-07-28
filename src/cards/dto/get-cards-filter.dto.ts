import {IsIn, IsNotEmpty, IsOptional} from 'class-validator';

export class GetCardsFilterDTO {

		@IsOptional()
		@IsNotEmpty()
		searchTerm: string;
}
