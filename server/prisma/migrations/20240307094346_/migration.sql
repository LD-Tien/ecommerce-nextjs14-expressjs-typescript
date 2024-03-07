-- DropForeignKey
ALTER TABLE `role_permission` DROP FOREIGN KEY `role_permission_ibfk_1`;

-- DropForeignKey
ALTER TABLE `role_permission` DROP FOREIGN KEY `role_permission_ibfk_2`;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
