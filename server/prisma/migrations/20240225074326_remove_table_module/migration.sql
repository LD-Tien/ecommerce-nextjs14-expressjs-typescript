/*
  Warnings:

  - You are about to drop the column `module_id` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the `module` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `permission` DROP FOREIGN KEY `permission_ibfk_1`;

-- AlterTable
ALTER TABLE `permission` DROP COLUMN `module_id`,
    ADD COLUMN `module` VARCHAR(200) NULL;

-- DropTable
DROP TABLE `module`;
