const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', (req, res) => {
  // check if logged in
  if (req.isAuthenticated()) {
    // send back user object from database
    res.send(req.user);
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  var saveUser = {
    username: req.body.username,
    password: encryptLib.encryptPassword(req.body.password)
  };
  console.log('new user:', saveUser);
  pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id', [saveUser.username, saveUser.password], (err, result) => {
    if (err) {
      console.log("Error inserting data: ", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(201);
    }
  });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.get('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});


/***********************************
****ADD ITEM TO JOBS TABLE****
 ***********************************
Insert catch data into table */
router.post('/addJob', function (req, res) {
  // console.log('in POST router');
  if (req.isAuthenticated()) {
    //add catch event to user data table
    const queryText = `INSERT INTO jobs 
    (date, 
    company,
    position,
    contact,
    email)
    VALUES ($1, $2, $3, $4, $5)`;
    pool.query(queryText, [
        req.body.date,
        req.body.company,
        req.body.position,
        req.body.contact,
        req.body.email,
      ])
      .then((result) => {
        console.log('result:', result);
        console.log(req.user.id);
        
        res.send(result);
      })
      // erorr handling
      .catch((err) => {
        console.log('error:', err);
        res.sendStatus(500);
      });
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }

  /* GET Status */
  router.get('/getStatus', function (req, res) {
    console.log('in getStatus router');
    const queryText = `SELECT name FROM status`;
    pool.query(queryText)
      .then((result) => {
        console.log('status result:', result);

        res.send(result.rows);

      })
      .catch((err) => {
        console.log('Error getting status', err);
        res.sendStatus(500);
      })
  });

  /***********************************
Get data from dB for jobs table
 ********************************* */
  router.get('/jobs', (req, res) => {
    // query DB
    if (req.isAuthenticated()) {
      const queryText = 
      `SELECT 
      date,
      company,
      position,
      contact,
      email
      FROM jobs 
      JOIN
      users on users.id = jobs.userid
      WHERE users.id = $1;`;
      pool.query(queryText, [req.user.id])
        // runs on successful query
        .then((result) => {
          console.log('query results', result);
          res.send(result.rows);
        })
        // error handling
        .catch((err) => {
          console.log('error making select query:', err);
          res.sendStatus(500);
        });
    } else {
      // failure best handled on the server. do redirect here.
      res.sendStatus(403);
    }
  });
});

module.exports = router;