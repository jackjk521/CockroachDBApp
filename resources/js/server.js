const express = require('express')
const bodyParser = require('body-parser')
const { Pool, Client } = require('pg')
const dotenv = require('dotenv')
const app = express()
const port = process.env.PGPORT || 3011
require('dotenv').config();

const connectionString = (process.env.DB_URL);

const pool = new Pool({
  connectionString,
})

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// queries routes
app.use("/", require("./deviceStateRoute"));

// FOR TESTING

const insertData = (request, response) => {
    const createAccounts = 'CREATE TABLE IF NOT EXISTS accounts (id SERIAL PRIMARY KEY, balance INT)';
    pool.query(createAccounts)
    // const fix1 = 'SELECT MAX(id) FROM accounts';

    // const fix2 = 'SELECT nextval(accounts_pkey_sequence)' ;

    const insert = 'INSERT INTO accounts (id, balance) VALUES (1, 1000)'
    // const delAccounts = pool.query('DROP TABLE accounts');

      // pool.query(fix1)
      // pool.query(fix2)
    

    pool.query(insert, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

app.listen(port, () => {
  if(pool){
    insertData()
    console.log(`App running on port ${port}.`)
  }
  
})