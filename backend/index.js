require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');

const app = require('./app');

/**
 * Port to listen on
 */
const PORT = Number(process.env.PORT) || 8080;

/**
 * Setting up the server
 */
const server = http.createServer(app);

/**
 * Checking to see if can connect to database before initializing server
 */
mongoose
  .connect('mongodb://localhost:27017/json-generator', {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('database connected');

    server.listen(PORT, () => {
      console.log(`[Server] Listening on ${PORT}`);
    });
  });
