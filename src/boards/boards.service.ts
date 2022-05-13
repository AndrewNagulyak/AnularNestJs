import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pagination, PaginationOptionsInterface } from '../paginate';
import { User } from '../auth/user.entity';
import { BoardsRepository } from './boards.repository';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BoardsService {
  constructor(
    @Inject(BoardsRepository)
    private boardRepository: BoardsRepository,
  ) {}

  getLastBoards(user: User): Observable<Board[]> {
    return from(this.boardRepository.getLastBoards(user));
  }

  paginate(
    options: PaginationOptionsInterface,
    user: User,
  ): Observable<Pagination<Board>> {
    return from(
      this.boardRepository.findAndCount({
        take: options.limit,
        skip: (options.page - 1) * options.limit,
        select: ['id', 'title', 'color', 'imgUrl', 'viewedDate'],
        where: { userId: user.id },
      }),
    ).pipe(
      map(([results, total]) => {
        return new Pagination<Board>({
          results,
          total,
        });
      }),
    );
  }

  async updateBoardById(id: number, user: User, card: CreateBoardDto) {
    const found = await this.boardRepository.update({ id }, card);
    if (!found) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    return found;
  }

  async getBoardById(id: number, user: User): Promise<Board> {
    const found = await this.boardRepository.findOne(+id);
    if (!found) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    return found;
  }

  // private cards: Card[] = [];
  //

  getAllBoards(user: User) {
    const foundedCards = this.boardRepository.getLastBoards(user);

    return foundedCards;
    // const {searchTerm, status} = filterDTO;
    //
    // if (searchTerm) {
    // 		foundedCards = foundedCards.filter(card => (card.title.includes(searchTerm)));
    //
    // }
    // if (status) {
    // 		foundedCards = foundedCards.filter(card => (card.status === status));
    // }
  }

  async createBoard(createBoard: CreateBoardDto, user: User): Promise<Board> {
    return this.boardRepository.createBoard(createBoard, user);
  }

  async deleteBoard(id: number, user: User) {
    const result = await this.boardRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    return { id: id };
  }
}
