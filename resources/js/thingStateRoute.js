
const fs = require('fs')
const dotenv = require('dotenv')
const {Pool} = require('pg')
const express = require("express");
const router = express.Router();
require('dotenv').config();
//sql import    

const connectionString = (process.env.DB_URL);

const pool = new Pool({
  connectionString,
})

// create a state for a topic?

router.route("/addSensor").post((req, res) =>{ 
    const stateInfo = {
        user_id: req.body.user_id,
        userName: req.body.userName,
        led: req.body.led,
        motion: req.body.motion,
        sound: req.body.sound,
        temp: req.body.temp,
        heart: req.body.heart
    }

    try{
        pool.query('INSERT INTO thing (user_id, userName, led, motion, sound, temp, heart) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [stateInfo.user_id, stateInfo.userName, stateInfo.led, stateInfo.motion, stateInfo.sound, stateInfo.temp, stateInfo.heart], (error, results) => {
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

// get all devices of a user_id that are "No Sensor Setup" (NEED TO EDIT)
router.route("/getNoSetupDev").post((req, res) =>{ 
    const user_id = req.body.user_id

    try{
        const result = pool.query('SELECT * FROM thing WHERE user_id = $1;',
            [user_id], (error, results) => {
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


// get all devices of a userID
router.route("/getDevices").post((req, res) =>{ 
    const user_id = req.body.user_id

    try{
        const result = pool.query('SELECT * FROM thing WHERE user_id = $1;',
            [user_id], (error, results) => {
            if (error) {
                res.status(404).send('The user with the given ID was not found.')
                throw error
            }
            console.log(user_id);
             res.status(200).json(results.rows)
        })

        return result; // I haven't checked what type is returned
    
    }
    catch(err){
        console.log(err.message);
    }
})

// update the state of a device
router.route("/deleteSensor").post((req, res) =>{ 
    const user_id = req.body.user_id
    const device = req.body.device

    try{ 
        pool.query('UPDATE thing SET $2 = $3 \
        WHERE user_id = $1 RETURNING *;',  // this returns all like .get()
            [user_id, device, 'No Sensor Setup'], (error, results) => {
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