-- Create database if not exists
CREATE DATABASE IF NOT EXISTS clinic_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE clinic_management;

-- Create tables (these will be created automatically by TypeORM, but this is for reference)
-- The tables will be created automatically when the application starts with synchronize: true 