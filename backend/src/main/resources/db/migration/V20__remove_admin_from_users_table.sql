-- Remove admin email from users table to prevent conflicts
-- Admin credentials should only exist in the administrators table
DELETE FROM users WHERE email = 'migrantcommunity2@gmail.com';
