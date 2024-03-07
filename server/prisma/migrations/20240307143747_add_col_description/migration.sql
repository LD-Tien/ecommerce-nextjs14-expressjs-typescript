/*
  Warnings:

  - Made the column `name` on table `role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `active` on table `role` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `role` ADD COLUMN `description` VARCHAR(2000) NULL,
    MODIFY `name` VARCHAR(50) NOT NULL,
    MODIFY `active` BOOLEAN NOT NULL DEFAULT false;
