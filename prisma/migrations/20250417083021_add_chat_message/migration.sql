-- CreateTable
CREATE TABLE
    "ChatStatus" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        CONSTRAINT "ChatStatus_pkey" PRIMARY KEY ("id")
    );

-- CreateTable
CREATE TABLE
    "ChatMessage" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "chatId" TEXT NOT NULL,
        "statusId" TEXT NOT NULL,
        "text" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
    );

-- CreateIndex
CREATE UNIQUE INDEX "ChatStatus_name_key" ON "ChatStatus" ("name");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "ChatStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddRecords
INSERT INTO
    "ChatStatus" ("id", "name")
VALUES
    ('1', 'Stored'),
    ('2', 'Received'),
    ('3', 'Read');