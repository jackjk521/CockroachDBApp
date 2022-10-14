
const fs = require('fs')
const dotenv = require('dotenv')
require('dotenv').config();
const Pool = require('pg')
const express = require("express");
const router = express.Router();

//sql import    

const connectionString = (process.env.DB_URL);

const pool = new Pool({
  connectionString,
})

// create a state for a topic?

router.route("/createState").post((req, res) =>{ 
    const stateInfo = {
        userID: req.body.userID,
        devState: req.body.devState,
        topic: req.body.topic
    }

    
    try{

        pool.query('INSERT INTO dev_state (userID, devState, topic) VALUES ($1, $2, $3)',
        [stateInfo.userID, stateInfo.devState, stateInfo.topic], (error, results) => {
           if (error) {
               res.status(404).send('There is an error in createState')
               throw error
           }
           res.status(200).json(results.rows[0])
       })
    
    }
    catch(err){
        console.log(err.message);
    }
})

// get all devices of a userID
router.route("/getDevices").get((req, res) =>{ 
    const userID = req.body.userID

    try{
        const result = pool.query('SELECT * FROM dev_states WHERE userID = $1;',
            [userID], (error, results) => {
            if (error) {
                res.status(404).send('The user with the given ID was not found.')
                throw error
            }
            res.status(200).json(results.rows)
        })

        return result; // I haven't checked what type is returned
    
    }
    catch(err){
        console.log(err.message);
    }
})

// update the state of a device
router.route("/updateDevState").post((req, res) =>{ 
    const userID = req.body.userID
    const devState = req.body.devState

    try{ 
        // device schema is in the schema.sql
        pool.query('UPDATE device SET devState = $2 \
        WHERE userID = $1 RETURNING *;',  // this returns all like .get()
            [userID, devState], (error, results) => {
            if (error) {
                console.log(error.stack)
                res.status(404).send('The state is not updated')
                throw error
            }
            res.status(200).json(results.rows[0])
        })
    }
    catch(err){
        console.log(err.message);
    }
})

module.exports = router;