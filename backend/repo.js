
require('dotenv').config();

const mongoose = require('mongoose');

const { Schema } = mongoose;
const uuid = require('uuid/v4');

const { MongoClient } = require('mongodb');

const dbpassword = process.env.MONGODB_PASSWORD;
const dbuser = process.env.MONGODB_USER;
const uri = `mongodb://${dbuser}:${dbpassword}@ds153824.mlab.com:53824/json-generator`;
console.log('USER: ', dbuser);


const userSchema = new Schema({
  userId: String,
  templateIds: Array
});

const templateSchema = new Schema({
  _id: String,
  json: String,
  userId: String,
  template: String,
  createdOn: String,
  updatedOn: String
});

const User = mongoose.model('User', userSchema);
const Template = mongoose.model('Template', templateSchema);

const connect = async (name = 'users') => {
  console.log(name);
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('json-generator');
    return db.collection(name);
  } catch (error) {
    console.log(error);
  }
  return client.close();
};
const mlabService = {
  pool: null,
  findUser: (userId) => connect().then((collection) => {
    const data = collection.findOne({ userId });
    console.log('\n');
    console.log(data);
    console.log('\n');
    return data;
  }).catch((error) => {
    console.log(error);
  }),
  createUser: async (userId) => {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db('json-generator');
      const collection = db.collection('users');
      const user = await collection.findOne({ userId });
      console.log('GUID: ', { userId });
      console.log('findOne: ', user);

      if (!user) {
        collection.insertOne(new User({ userId, templateIds: [] }));
      } else {
        console.log('\n');
        console.log('USER EXISTS');
        console.log('\n');
      }
      console.log('\nDONE\n');
    } catch (error) {
      console.log(error);
    }
    client.close();
  },
  getTemplate: ({ templateId }) => {
    console.log('\n');
    console.log('TEMPLATE_ID:', templateId);
    console.log('\n');
    return connect('json').then((collection) => collection.findOne({ _id: templateId })).catch((error) => {
      console.log(error);
    });
  },
  // getTemplate: ({ userId, templateId }) => {
  //   console.log('\n')
  //   console.log('USER_ID:', userId,'TEMPLATE_ID:', templateId)
  //   console.log('\n')
  //   return connect().then(async (collection) => {
  //     const user = await collection.findOne({ userId })
  //     console.log(user)
  //     return user.templates.find(({ id }) => templateId === id)
  //   }).catch((error) => {
  //     console.log(error)
  //   })
  // },
  createTemplate: ({ userId, template, json }) => {
    console.log('CREATE NEW TEMPLATE...');
    const date = new Date().toLocaleString();
    const templateId = uuid();
    const data = new Template({
      _id: templateId, json, userId, template, createdOn: date, updatedOn: date
    });
    return Promise.all([
      // Update our user with the new template ID
      connect().then(async (collection) => {
        const user = await collection.findOne({ userId });
        const templateIds = [...user.templateIds, templateId];
        await collection.updateOne({ userId }, new User({ ...user, templateIds }));
      }),
      // Add our template to the "json" collection
      connect('json').then((collection) => collection.insertOne(data))
    ]).then(() => data).catch((error) => {
      console.log(error);
      return error;
    });
  }
};

module.exports = mlabService;
