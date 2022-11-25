const express = require('express')
const bodyParser = require('body-parser')
const { Pool} = require('pg')
const dotenv = require('dotenv')
const app = express()
const port = 3011
const cors = require("cors");
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
app.use(cors());

// queries routes
app.use("/", require("./thingStateRoute"));

// FOR TESTING

const genThingTable = (request, response) => {
    const thingTable = 'CREATE TABLE IF NOT EXISTS thing (thing_id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL, name STRING NOT NULL,  led STRING NOT NULL, sound STRING NOT NULL,  temp STRING NOT NULL, motion STRING NOT NULL,  heart STRING NOT NULL, user_id STRING NOT NULL)';
    pool.query(thingTable, (error, results) => {
      if (thingTable) {
        console.log(results)
        console.log("Sucess in creating table") 
      }
      else{
        throw error
      }
    })
  }

const displayAll = () =>{
  const res = 'SELECT * from thing;'
  pool.query(res, (error, results) => {
    if (res) {
      console.log(results.rows)
    }
    else{
      throw error
    }
  })
}
app.listen(port, () => {
  if(pool){
    genThingTable()
    console.log(`App running on port ${port}.`)
    displayAll();
  }
})