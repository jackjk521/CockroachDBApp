
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


router.route("/deleteAll").post((req, res) => {
    const query = "DELETE FROM thing WHERE thing_id NOT IN (SELECT thing_id FROM thing WHERE thing_id = '86b85cc4-8740-48ba-bedb-dec315df51a0' )"
    pool.query(query, [], (err, results) => {
        if(err) {
            res.status(404).send('There is an error in creation of a new user')
        } else {
            res.status(200).json(results.rows)
        }
    }) 
    
})

// registering a new user
router.route("/newUser").post((req, res) =>{ 
    const newUser = {
        user_id: req.body.user_id,
        name: 'test',
        led: '0',
        motion: '0',
        sound: '0',
        temp: '0',
        heart: '0'
    }

    try{
        pool.query('INSERT INTO thing (user_id, name, led, motion, sound, temp, heart) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [newUser.user_id, newUser.name, newUser.led, newUser.motion, newUser.sound, newUser.temp, newUser.heart], (error, results) => {
           if (error) {
               res.status(404).send('There is an error in creation of a new user')
               throw error
           }
           res.status(200).json(results.rows[0])
       })
    
    }
    catch(err){
        console.log(err.message);
    }
})


// addSensor

router.route("/addSensor").post((req, res) =>{ 
    const stateInfo = {
        user_id: req.body.user_id,
        name: req.body.name,
        led: req.body.led,
        motion: req.body.motion,
        sound: req.body.sound,
        temp: req.body.temp,
        heart: req.body.heart
    }

    try{
        pool.query('INSERT INTO thing (user_id, name, led, motion, sound, temp, heart) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [stateInfo.user_id, stateInfo.name, stateInfo.led, stateInfo.motion, stateInfo.sound, stateInfo.temp, stateInfo.heart], (error, results) => {
           if (error) {
               res.status(404).send('There is an error in the addsensor route')
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
router.route("/getDevices").get((req, res) =>{ 
    const user_id = req.query.user_id
    console.log(req.query)
    console.log("userid in thingsRoute: " + user_id);
    try{
        const result = pool.query('SELECT * FROM thing WHERE user_id = $1;',
            [user_id], (error, results) => {
            if (error) {
                res.status(404).send('The user with the given ID was not found.')
                throw error
            }
            console.log(results.rows);
            res.status(200).json(results.rows)
        })
    
    }
    catch(err){
        console.log(err.message);
    }
})

// update the state of a device
router.route("/updateSensor").post((req, res) =>{ 

        const user_id =  req.body.user_id;
        const name = req.body.name;
        const sensor = req.body.sensor;
        const value = req.body.value;

        console.log(`UPDATE thing SET ${sensor} = ${value} WHERE user_id = '${user_id}' AND name = '${name}'`);

        try {
            pool.query(`UPDATE thing SET ${sensor} = ${value} WHERE user_id = '${user_id}' AND name = '${name}'`, (error, results) => {
                if(error) {
                    res.status(400).send("Not updated");
                    console.log(error)
                } else {
                    res.status(200).json(results);
                }
            })
        } catch (err) {
            console.log(err)
        }


    // try{ 
    //     pool.query('UPDATE thing SET $1 = $2 WHERE user_id = $3 AND name = $4;',  // this returns all like .get()
    //         [sensor, value, user_id, name], (error, results) => {
    //         if (error) {
    //             console.log(error.stack)
    //             res.status(404).send('The state is not updated')
    //             throw error
    //         }
    //         res.status(200).json(results.rows[0])
    //     })
    // }
    // catch(err){
    //     console.log(err.message);
    // }
})

router.route("/findThing").post((req, res) =>{ 

    const name = req.body.name;
    const user_id = req.body.user_id;

    try{ 
        pool.query('SELECT * FROM thing WHERE user_id = $1 AND name = $2;',
        [user_id, name], (error, results) => {
            if (error) {
                res.status(404).send('The state is not updated');
                throw error
            }
            console.log("results is ")
            console.log(results.rows)
            res.status(200).json(results.rows[0])
        })
    }
    catch(err){
        console.log(err.message);
    }
})




module.exports = router;