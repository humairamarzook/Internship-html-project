CREATE DATABASE IF NOT EXISTS `your_project_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

USE `your_project_db`;

CREATE TABLE IF NOT EXISTS `entries` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `gender` VARCHAR(32) NOT NULL,
    `address` TEXT NOT NULL,
    `dob` DATE NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;
