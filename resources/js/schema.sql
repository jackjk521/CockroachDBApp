CREATE TABLE dev_states (
    id SERIAL PRIMARY_KEY,
    userID VARCHAR(255) UNIQUE, 
    topic VARCHAR(255),
    devState INT ,
    date_created TIMESTAMP,
)

CREATE SCHEMA device (
    id SERIAL PRIMARY_KEY,
    userID VARCHAR(255) UNIQUE, 
    topic VARCHAR(255),
    devState INT ,
)