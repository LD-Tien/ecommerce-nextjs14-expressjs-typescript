/*
  Warnings:

  - Made the column `name` on table `permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `method` on table `permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `api` on table `permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `active` on table `permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `module` on table `permission` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `permission` MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `method` VARCHAR(10) NOT NULL,
    MODIFY `api` VARCHAR(500) NOT NULL,
    MODIFY `active` BOOLEAN NOT NULL,
    MODIFY `module` VARCHAR(200) NOT NULL;
