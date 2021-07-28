import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth/auth.module';
import {BoardsController} from './boards.controller';
import {BoardsService} from './boards.service';
import {BoardsRepository} from './boards.repository';

@Module({
 controllers: [BoardsController],
 providers: [BoardsService],
 imports: [TypeOrmModule.forFeature([BoardsRepository]),
	AuthModule]
})
export class BoardsModule {}
