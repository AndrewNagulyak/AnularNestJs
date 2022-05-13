import { EntityRepository, Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@EntityRepository(Board)
export class BoardsRepository extends Repository<Board> {
  private logger = new Logger('BoardRepository');

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, imgUrl, color } = createBoardDto;
    const board = new Board();
    board.title = title;
    board.imgUrl = imgUrl;
    board.createdDate = new Date().toISOString();
    board.viewedDate = new Date().toISOString();
    board.modifiedDate = new Date().toISOString();
    if (color) {
      board.color = color;
    }
    board.user = user;
    await board.save();
    delete board.user;
    return board;
  }

  async getLastBoards(user: User): Promise<Board[]> {
    const queary = this.createQueryBuilder('board');
    queary.select([
      'board.id',
      'board.title',
      'board.viewedDate',
      'board.color',
      'board.imgUrl',
    ]);
    queary.take(4).orderBy('board.viewedDate', 'ASC');
    queary.where('board.userId = :userId', { userId: user.id });
    try {
      const boards = queary.getMany();
      return boards;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
