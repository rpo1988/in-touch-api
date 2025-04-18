import { Chat, ChatMessage, ChatMessageStatus, User } from '@prisma/client';

export class ChatListResponseDto {
  chat: Pick<Chat, 'id' | 'isGroup' | 'title'>;
  members: Pick<User, 'id'>[];
  lastMessages: (Pick<ChatMessage, 'id' | 'text' | 'createdAt'> & {
    user: Pick<User, 'id'>;
    status: Pick<ChatMessageStatus, 'id'>;
  })[];
}
