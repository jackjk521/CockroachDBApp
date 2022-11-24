
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
        name: req.body.name,
        led: req.body.led,
        motion: req.body.motion,
        sound: req.body.sound,
        temp: req.body.temp,
        heart: req.body.heart
    }

    try{
        pool.query('INSERT INTO thing (user_id, userName, name, led, motion, sound, temp, heart) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [stateInfo.user_id, stateInfo.userName, stateInfo.name, stateInfo.led, stateInfo.motion, stateInfo.sound, stateInfo.temp, stateInfo.heart], (error, results) => {
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

// get all devices of a user_id that are "0"
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
    
    }
    catch(err){
        console.log(err.message);
    }
})

// update the state of a device
router.route("/updateSensor").post((req, res) =>{ 

    const updateInfo = {
        user_id: req.body.user_id,
        name: req.body.name,
        sensor:  req.body.sensor,
        value: req.body.value
    }

    try{ 
        pool.query('UPDATE thing SET $2 = $3 \
        WHERE user_id = $1 AND name = $4 RETURNING *;',  // this returns all like .get()
            [updateInfo.user_id, updateInfo.sensor, updateInfo.value, updateInfo.name], (error, results) => {
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

router.route("/findThing").post((req, res) =>{ 

    const name = req.body.name;
    const user_id = req.body.user_id;

    try{ 
        pool.query('SELECT * FROM thing WHERE user_id = $1 AND name = $2;',
        [user_id, name], (error, results) => {
            if (error) {
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