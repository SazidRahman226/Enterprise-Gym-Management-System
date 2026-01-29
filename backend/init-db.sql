-- Create gym_sazid database as a fallback (in case legacy connections try to use it)
CREATE DATABASE gym_sazid OWNER gym_sazid;

-- Grant all privileges on both databases
GRANT ALL PRIVILEGES ON DATABASE gym TO gym_sazid;
GRANT ALL PRIVILEGES ON DATABASE gym_sazid TO gym_sazid;
-- Insert initial membership plans
INSERT INTO membership_plans (name, duration_days, base_fee, access_level) VALUES
('Silver', 30, 29, 'basic'),
('Gold', 30, 59, 'premium'),
('Platinum', 30, 99, 'vip');