CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  game_id integer not null,
  round_number integer not null,
  offerer_id integer not null,
  recipient_id integer null,
  amount integer not null,
  accepted boolean null
);