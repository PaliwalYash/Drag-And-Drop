/*
  Warnings:

  - You are about to drop the column `column` on the `components` table. All the data in the column will be lost.
  - You are about to drop the column `row` on the `components` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "components" DROP COLUMN "column",
DROP COLUMN "row",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "paneId" TEXT,
ADD COLUMN     "panePosition" INTEGER;
