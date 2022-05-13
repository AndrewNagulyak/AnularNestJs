import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationEntity } from './models/conversation.entity';
import { ActiveConversationEntity } from './models/active-conversation.entity';
import { ConversationService } from './services/consversation.service';
import { MessageEntity } from './models/message.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/services/auth.service';
import { UserRepository } from '../auth/user.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ConversationEntity,
      ActiveConversationEntity,
      MessageEntity,
    ]),
    JwtModule.register({
      secret: 'topSeret61',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [ChatGateway, ConversationService],
})
export class ChatModule {}
