BEGIN TRANSACTION;

CREATE TABLE drivers (
  id serial PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50),
  email text UNIQUE NOT NULL,
  password_hash VARCHAR(100),
  mobile varchar(15) UNIQUE,
  available BOOLEAN DEFAULT true,
  token varchar(1000)
);

COMMIT;