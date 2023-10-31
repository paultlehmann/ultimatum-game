ALTER TABLE offers
ADD CONSTRAINT fk_recipient_users FOREIGN KEY (recipient_id) REFERENCES users (id);

ALTER TABLE offers
ADD CONSTRAINT fk_offerer_users FOREIGN KEY (offerer_id) REFERENCES users (id);