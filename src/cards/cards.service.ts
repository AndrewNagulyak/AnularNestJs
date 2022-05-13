import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CardsRepository } from './cards.repository';
import { User } from '../auth/user.entity';
import { Card } from './card.entity';
import { GetCardsFilterDTO } from './dto/get-cards-filter.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { Pagination, PaginationOptionsInterface } from '../paginate';

@Injectable()
export class CardsService {
  constructor(
    @Inject(CardsRepository)
    private cardRepository: CardsRepository,
  ) {}

  async paginate(
    options: PaginationOptionsInterface,
  ): Promise<Pagination<Card>> {
    const [results, total] = await this.cardRepository.findAndCount({
      take: options.limit,
      skip: (options.page - 1) * options.limit, // think this needs to be page * limit
    });

    // TODO add more tests for paginate

    return new Pagination<Card>({
      results,
      total,
    });
  }

  async updateCardById(id: number, user: User, card: CreateCardDto) {
    const property = await this.cardRepository.findOne({
      where: { id },
    });
    const found = await this.cardRepository.save({
      id: id,
      ...property,
      ...card,
    });
    console.log(found);
    if (!found) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return found;
  }

  async getCardById(id: number, user: User): Promise<Card> {
    const found = await this.cardRepository.findOne(+id);
    if (!found) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return found;
  }

  // private cards: Card[] = [];
  //

  getAllCards(user: User, filterDTO?: GetCardsFilterDTO) {
    const foundedCards = this.cardRepository.getCards(user, filterDTO);

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

  async createCard(createCard: CreateCardDto, user: User): Promise<Card> {
    return this.cardRepository.createCard(createCard, user);
  }

  async deleteCard(id: number, user: User) {
    const result = await this.cardRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return { id: id };
  }
}
