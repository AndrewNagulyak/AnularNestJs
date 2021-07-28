import {
 Body,
 Controller,
 Delete,
 Get,
 Request,
 Logger,
 Param,
 ParseIntPipe,
 Patch,
 Post,
 Query,
 UseGuards,
 UsePipes,
 ValidationPipe
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {CardsService} from './cards.service';
import {GetUser} from '../auth/decorators/get-user.decorator';
import {User} from '../auth/user.entity';
import {GetCardsFilterDTO} from './dto/get-cards-filter.dto';
import {CreateCardDto} from './dto/create-card.dto';
import {Pagination} from '../paginate';
import {Card} from './card.entity';

@Controller('cards')
@UseGuards(AuthGuard())
export class CardsController {
 constructor(private cardsService: CardsService) {
 }

 private logger = new Logger('CardsController');

 @Get()
 async index(@Request() request): Promise<Pagination<Card>> {
	return await this.cardsService.paginate({
	 limit: request.query.hasOwnProperty('limit') ? request.query.limit : 10,
	 page: request.query.hasOwnProperty('page') ? request.query.page : 0,
	});
 }


 // @Get()
 // getAllCards(
	// @GetUser() user: User,
	// @Query(ValidationPipe) filterDto?: GetCardsFilterDTO) {
	// this.logger.verbose(`User ${user.username} retrieving all cards. Filters ${JSON.stringify(filterDto)}`)
	// return this.cardsService.getAllCards(user, filterDto);
 // }

 @Get('/:id') getById(
	@GetUser() user: User,
	@Param('id', ParseIntPipe) id: number) {
	return this.cardsService.getCardById(id, user);
 }

 @Patch('/:id')
 @UsePipes(ValidationPipe) updateCard(
	@GetUser() user: User,
	@Param('id', ParseIntPipe) id: number, @Body() createCardDto: CreateCardDto) {
	return this.cardsService.updateCardById(id, user, createCardDto);
 }

 @Post()
 @UsePipes(ValidationPipe)
 createCard(@Body() createCardDto: CreateCardDto, @GetUser()user: User) {
	return this.cardsService.createCard(createCardDto, user);
 }

 @Delete('/:id')
 deleteCard(
	@GetUser() user: User,
	@Param('id', ParseIntPipe) id: number) {
	return this.cardsService.deleteCard(id, user);
 }


}
