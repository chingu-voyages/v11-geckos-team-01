/**
 * @jest-environment node
 */

const mongoose = require('mongoose');
const request = require('supertest');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

dotenv.config();

const app = require('../app');

let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  await mongoose.connect(
    mongoUri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) console.error(err);
    }
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test('that it works', async () => {
  const response = await request(app).get('/');

  expect(response.ok).toBeTruthy();
});
