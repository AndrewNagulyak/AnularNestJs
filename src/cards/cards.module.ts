import {CardsController} from './cards.controller';
import {CardsService} from './cards.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CardsRepository} from './cards.repository';
import {AuthModule} from '../auth/auth.module';
import {Module} from '@nestjs/common';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports: [TypeOrmModule.forFeature([CardsRepository]),
  AuthModule]
})
export class CardsModule {}
