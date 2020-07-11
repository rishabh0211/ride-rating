BEGIN TRANSACTION;

CREATE TABLE rides (
  id serial PRIMARY KEY,
  driver_id SMALLINT REFERENCES drivers(id),
  customer_id SMALLINT REFERENCES customers(id),
  -- ride_date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP,
  driver_rating SMALLINT,
  source VARCHAR(100) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  customer_rating SMALLINT
);

COMMIT;