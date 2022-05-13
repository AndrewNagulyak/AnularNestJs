import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Pagination } from '../paginate';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/user.entity';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { Observable } from 'rxjs';

@Controller('/api/boards')
@UseGuards(AuthGuard())
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  private logger = new Logger('BoardsController');

  @Get()
  index(
    @Request() request,
    @GetUser() user: User,
  ): Observable<Pagination<Board>> {
    return this.boardsService.paginate(
      {
        limit: request.query.hasOwnProperty('limit') ? request.query.limit : 10,
        page: request.query.hasOwnProperty('page') ? request.query.page : 1,
      },
      user,
    );
  }

  @Get('/last')
  getLast(@Request() request, @GetUser() user: User): Observable<Board[]> {
    return this.boardsService.getLastBoards(user);
  }

  // @Get()
  // getAllBoards(
  // @GetUser() user: User,
  // @Query(ValidationPipe) filterDto?: GetBoardsFilterDTO) {
  // this.logger.verbose(`User ${user.username} retrieving all cards. Filters ${JSON.stringify(filterDto)}`)
  // return this.cardsService.getAllBoards(user, filterDto);
  // }

  @Get('/:id') getById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.boardsService.getBoardById(id, user);
  }

  @Patch('/:id') updateBoard(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    return this.boardsService.updateBoardById(id, user, createBoardDto);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: CreateBoardDto, @GetUser() user: User) {
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Delete('/:id')
  deleteBoard(@GetUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.boardsService.deleteBoard(id, user);
  }
}
