// Author: Naman Bhatt
// Advisor: Dr. Bimal Ghimere
// Version: 2.0
// Project: CMPSC 488 Authflow Authenticator
// server.js for Authflow Authenticator
// Date Created: 2/5/2024
// Last Updated: 3/27/2024
// Description: This is the server side code for the Authflow Authenticator application. It includes the routes for enrolling users, verifying passkeys, and fetching user accounts.
// This code is part of the CMPSC 488 course project at Penn State University.
// Total time was spent on this code: 7 hours 
// Total line of code in this file: 299 lines

const express = require('express');
const { auth } = require('express-openid-connect');
const mysql = require('mysql');

const app = express();
const port = 3000; // Default port or choose your preferred one


// Auth0 configuration
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'aRRWvT018Ls2zbNLDloG5vDRL8qwVYEx',
    issuerBaseURL: 'https://authflowauthenticator.us.auth0.com'
  };

// Auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

const bodyParser = require('body-parser');
const speakeasy = require('speakeasy');
const crypto = require('crypto');
// For connecting two local host
const cors = require('cors');

const fs = require('fs');
const path = require('path');
const winston = require('winston');

// Log files paths
const errorLogPath = path.join(__dirname, 'error.log');
const combinedLogPath = path.join(__dirname, 'authflow.log');

// Function to clear log files
const clearLogFile = (filePath) => {
  fs.writeFileSync(filePath, '', (err) => {
    if (err) {
      console.error(`Error clearing log file ${filePath}: ${err}`);
    }
  });
};

// Clear log files on startup
clearLogFile(errorLogPath);
clearLogFile(combinedLogPath);

// Winston logger configuration
const logger = winston.createLogger({
  // Change to 'debug' for more verbose logging
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  
  // Log to console and files
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'authflow.log' })
  ],
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'naman',
    password: 'authflow',
    database: 'account_manager',
  });
  
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the MySQL server.');
  });

  app.use(cors());

  let userAttempts = {};
  app.use(bodyParser.json());
  
  app.get('/', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        const userEmail = req.oidc.user.email;
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        // Set all users to not currently logged in
        connection.query('UPDATE clients SET is_currently_logged_in = 0', (err) => {
            if (err) throw err;
            console.log('Reset login status for all users.');
        });

        // Insert or update client entry for currently logged in user
        const query = `INSERT INTO clients (email, created_at, last_login, is_currently_logged_in) VALUES (?, ?, ?, 1) ON DUPLICATE KEY UPDATE last_login=?, is_currently_logged_in=1`;
        
        connection.query(query, [userEmail, currentTime, currentTime, currentTime], (err, results) => {
            if (err) throw err;
            console.log('User login details updated in the database.');
        });

        res.sendFile(__dirname + '/profile.html');
    } else {
        res.sendFile(__dirname + '/login.html');
    }
});


const fetch = require('node-fetch');
require('dotenv').config();


const OpenAI = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Route to chatbot
app.post('/chatbot', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", 
        prompt: `This is a chatbot for the AuthFlow Authenticator app which is similar to the Microsoft Authenticator. A user asks: ${userMessage}\n\n`,
        temperature: 0.7,
        max_tokens: 13,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      })
    });

    const jsonResponse = await response.json();
    if (response.ok) {
      res.json({ reply: jsonResponse.choices[0].text.trim() });
    } else {
      console.error('OpenAI API error:', jsonResponse);
      res.status(500).json({ message: 'Error processing your request with OpenAI' });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


  // Function to refresh passkey
const refreshPasskey = () => {
  const selectQuery = 'SELECT id, secret FROM users';
  connection.query(selectQuery, (err, results) => {
    logger.error(err);
    if (err) console.error(err);
    else {
      results.forEach(user => {
        // Generate new token for each user
        const token = speakeasy.totp({
          secret: user.secret,
          encoding: 'base32'
        });

      console.log('Passkeys refreshed');
      logger.info('Passkeys refreshed');
    }
 )};
}
)};

setInterval(refreshPasskey, 30000);

  app.post('/verifyAndRegister', (req, res) => {

    logger.info('Entering /verifyAndRegister endpoint');
    const { code } = req.body;
  
    // Logging the received email and code for verification
    logger.info(`Attempting to verify and register for email with code: ${code}`);
    // Corrected to use email for the query to fetch the user data, including the authFlowCode
    const query = 'SELECT email, password_hash , pin, idp FROM authflowusers WHERE pin = ?';
  
    connection.query(query, [code], (err, results) => { // Using code to fetch the record
      if (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error fetching user data' });
      }
      if (err) {
        logger.error('Database query error: ${err.message}');
      }
  
      if (results.length > 0 && results[0].pin === code) {
        const user = results[0];
        
        logger.info(`User found and enrolled for AuthFlow`);
  
        // Now correctly comparing the provided code with the authFlowCode from the database
        if (user.pin === code) {
          logger.info(`Code matched for email`);
          // If codes match, proceed with user migration to 'users' table
          const secret = speakeasy.generateSecret({length: 20});
          const token = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
          });
          
          const insertQuery = 'INSERT INTO users (email, secret, idp) VALUES (?, ?, ?)';
          connection.query(insertQuery, [user.email, secret.base32, user.idp], (insertErr, insertResult) => {
            if (insertErr) {
              console.error(insertErr);
              return res.status(500).send({ message: 'Error adding user to users table' });
            }
  
            if (insertErr) {
              logger.error(`Error adding user to users table: ${insertErr.message}`);
            }
  
          logger.info(`Account verified and registered successfully for user `); 
          res.send({ message: 'Account verified and registered successfully', secret: secret.base32 });
          });
        } else {
          // Code does not match
          logger.warn(`Incorrect code provided for user`);
          res.status(401).send({ message: 'Incorrect code, please try again' });
        }
      } 
      else {
        // User not found or not enrolled
        logger.warn(`User not found or not enrolled for AuthFlow`);
        res.status(404).send({ message: 'User not found or not enrolled for AuthFlow' });
      }
    });
    logger.info('Exiting /verifyAndRegister endpoint');
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });

// Route to delete an account by email
app.delete('/deleteAccount', (req, res) => {
  const { email } = req.body;
  logger.info(`Request received to delete account for email: ${email}`);
  
  // First, delete the account from the users table
  const deleteUserQuery = 'DELETE FROM users WHERE email = ?';
  connection.query(deleteUserQuery, [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error deleting user account' });
    }
    if (err) {
      logger.error(`Error deleting user account for email ${email}: ${err}`);
    }
    logger.info(`User account for email ${email} deleted successfully.`);
  });
});

app.post('/verify-passkey', (req, res) => {
    const { email, passkey } = req.body;
    const query = 'SELECT secret FROM users WHERE email = ?';

    connection.query(query, [email], (err, results) => {
        if (err) {
            logger.error(`Database query error: ${err.message}`);
            return res.status(500).send({ message: 'Error fetching user data' });
        }

        if (results.length > 0) {
            const secret = results[0].secret;
            const verified = speakeasy.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: passkey,
                window: 1 // Allows for a bit of time skew.
            });

            if (verified) {
                res.json({ success: true, message: 'Passkey verified successfully' });
            } else {
                res.status(401).send({ success: false, message: 'Invalid passkey' });
            }
        } else {
            res.status(404).send({ success: false, message: 'User not found' });
        }
    });
});



// Get Accounts endpoint to fetch all accounts 
app.get('/getAccounts', (req, res) => {
  logger.info('Entering /getAccounts endpoint');
  const selectQuery = 'SELECT email, secret, idp FROM users';
  connection.query(selectQuery, (err, results) => {
    if (err) {
      logger.error(`Error fetching accounts from database: ${err.message}`);
      console.error(err);
      return res.status(500).send({ message: 'Error fetching accounts' });
    } 

    const accounts = results.map(user => {
      let isSuspended = false;
      const now = new Date();
      // Check if the account is suspended
      if (userAttempts[user.email] && userAttempts[user.email].suspendedUntil && userAttempts[user.email].suspendedUntil > now) {
        isSuspended = true;
      }
      
      return {
        email: user.email,
        passkey: speakeasy.totp({
          secret: user.secret,
          encoding: 'base32'
        }),
        idp: user.idp,
        isSuspended: isSuspended, // Add suspension status
      };
    });

    logger.info(`Successfully fetched accounts. Number of accounts fetched: ${accounts.length}`);
    res.json(accounts);
  });
});

app.post('/recoverAccount', (req, res) => {
  const { email } = req.body;
  // Check if the email is in the user_info table but not in the users table
  const checkQuery = `SELECT * FROM user_info WHERE email = ?`;
  connection.query(checkQuery, [email], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).send({ message: 'Database error.' });
      }
      if (results.length > 0) {
          // If email exists, get the security questions
          const questions = [results[0].question1, results[0].question2, results[0].question3];
          const answers = [results[0].answer1, results[0].answer2, results[0].answer3];
          res.json({ questions, answers });
      } else {
          res.status(404).send({ message: 'Email not found or account still exists.' });
      }
  });
});

// Starting the server
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
