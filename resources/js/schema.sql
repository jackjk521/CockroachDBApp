CREATE TABLE IF NOT EXISTS thing (
  thing_id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
  userName STRING NOT NULL,
  led STRING NOT NULL,
  sound STRING NOT NULL,
  temp STRING NOT NULL,
  motion STRING NOT NULL,
  heart STRING NOT NULL,
  user_id STRING NOT NULL,
);