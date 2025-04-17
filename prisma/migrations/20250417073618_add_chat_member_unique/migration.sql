/*
  Warnings:

  - A unique constraint covering the columns `[userId,chatId]` on the table `ChatMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatMember_userId_chatId_key" ON "ChatMember"("userId", "chatId");
