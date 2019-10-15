require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const http = require('http');

const app = require('./app');

/**
 * Port to listen on
 */
const PORT = Number(process.env.PORT) || 8080;
const { MONGO_PASSWORD, MONGO_USER, MONGO_URL } = process.env;

/**
 * Setting up the server
 */
const server = http.createServer(app);

const mongodbOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true
};

/**
 * Checking to see if can connect to database before initializing server
 */
const db = MONGO_USER ? mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}`, mongodbOptions) : mongoose.connect(`mongodb://${MONGO_URL}`, mongodbOptions);

db
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('[Database] connected');

    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`[Server] Listening on ${PORT}`);
    });
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log('[Database - Error]', error.message);
  });
