-- Create gym_sazid database as a fallback (in case legacy connections try to use it)
CREATE DATABASE gym_sazid OWNER gym_sazid;

-- Grant all privileges on both databases
GRANT ALL PRIVILEGES ON DATABASE gym TO gym_sazid;
GRANT ALL PRIVILEGES ON DATABASE gym_sazid TO gym_sazid;
