-- Create database
CREATE DATABASE IF NOT EXISTS apartment_db;

USE apartment_db;

-- The tables will be created automatically by Spring Boot JPA
-- This script is just for creating the database

-- Optional: Create an admin user (password is 'admin123' hashed with BCrypt)
-- You can run this after starting the application once to create tables
-- INSERT INTO users (username, password, email, role) 
-- VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@apartment.com', 'ADMIN');
