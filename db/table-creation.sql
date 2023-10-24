CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  game_id integer not null,
  round_number integer not null,
  offerer_id integer not null,
  recipient_id integer null,
  amount integer not null,
  accepted boolean null
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username varchar(100) not null,
  password varchar(100) null,
  email varchar(100) null,
  admin boolean not null
);

CREATE TYPE stage_option AS ENUM ('pre', 'offer', 'accept', 'post');
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  admin integer not null,
  participants integer[] not null default array[]::integer[],
  round integer not null default 1,
  stage stage_option not null default 'pre'
);