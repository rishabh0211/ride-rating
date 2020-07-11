BEGIN TRANSACTION;

CREATE TABLE customers (
  id serial PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50),
  email text UNIQUE NOT NULL,
  password_hash VARCHAR(100),
  mobile varchar(15) UNIQUE,
  token varchar(1000)
);

COMMIT;