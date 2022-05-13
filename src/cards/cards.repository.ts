import { EntityRepository, Repository } from 'typeorm';
import { Card } from './card.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCardsFilterDTO } from './dto/get-cards-filter.dto';

@EntityRepository(Card)
export class CardsRepository extends Repository<Card> {
  private logger = new Logger('CardRepository');

  async createCard(creatCardDto: CreateCardDto, user: User): Promise<Card> {
    const { title, boardId } = creatCardDto;
    const card = new Card();
    card.title = title;
    card.boardId = boardId;
    card.user = user;
    await card.save();
    delete card.user;
    return card;
  }

  async getCards(user: User, filterDto: GetCardsFilterDTO): Promise<Card[]> {
    const { searchTerm } = filterDto;
    const queary = this.createQueryBuilder('card');
    queary.where('card.userId = :userId', { userId: user.id });
    if (searchTerm) {
      queary.andWhere('card.title LIKE :searchTerm', {
        searchTerm: `%${searchTerm}%`,
      });
    }
    try {
      const cards = queary.getMany();
      return cards;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
