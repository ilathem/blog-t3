/*
  Warnings:

  - You are about to drop the column `userId` on the `UserPost` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `UserPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserPost" DROP CONSTRAINT "UserPost_userId_fkey";

-- AlterTable
ALTER TABLE "UserPost" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserPost" ADD CONSTRAINT "UserPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
