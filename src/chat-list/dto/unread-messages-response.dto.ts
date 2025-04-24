import { Chat } from '@prisma/client';

export class UnreadMessagesResponseDto {
  chatId: Chat['id'];
  unreadMessagesLength: number;
}
