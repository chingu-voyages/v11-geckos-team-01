
require('dotenv').config()

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuid = require('uuid/v4')

const MongoClient = require('mongodb').MongoClient

const dbpassword = process.env.MONGODB_PASSWORD
const dbuser = process.env.MONGODB_USER
const uri = `mongodb://${dbuser}:${dbpassword}@ds153824.mlab.com:53824/json-generator`
console.log('USER: ', dbuser)


const userSchema = new Schema({
  userId: String,
  templates: Array
})

const templateSchema = new Schema({
  templateId: String,
  json: String,
  userId: String,
  template: String,
  createdOn: String,
  updatedOn: String
})

const User = mongoose.model('User', userSchema)
const Template = mongoose.model('Template', templateSchema)

const connect = async (name = 'users') => {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db('json-generator')
    return db.collection(name)
  } catch (error) {
    console.log(error)
  }
  client.close()
}
const mlabService = {
  pool: null,
  findUser: (userId) => {
    return connect().then((collection) => {
      const data = collection.findOne({ userId })
      console.log('\n')
      console.log(data)
      console.log('\n')
      return data
    }).catch((error) => {
      console.log(error)
    })
  },
  createUser: async (userId) => {
    const client = new MongoClient(uri)
    try {
      await client.connect()
      const db = client.db('json-generator')
      const collection = db.collection('users')
      const user = await collection.findOne({ userId })
      console.log('GUID: ', { userId })
      console.log('findOne: ', user)

      if (!user) {
        collection.insertOne(new User({ userId, templates: [] }))
      } else {
        console.log('\n')
        console.log('USER EXISTS')
        console.log('\n')
      }
      console.log('\nDONE\n')
    } catch (error) {
      console.log(error)
    }
    client.close()
  },
  getTemplate: ({ userId, templateId }) => {
    console.log('\n')
    console.log('USER_ID:', userId,'TEMPLATE_ID:', templateId)
    console.log('\n')    
    return connect().then(async (collection) => {
      const user = await collection.findOne({ userId })
      console.log(user)
      return user.templates.find(({ id }) => templateId === id)
    }).catch((error) => {
      console.log(error)
    })
  },
  createTemplate: async ({ userId, template, json }) => {
    const date = new Date().toLocaleString()
    const nextState = new Template({
      id: uuid(), json, userId, template, createdOn: date, updatedOn: date
    })
    return connect().then(async (collection) => {
      const user = await collection.findOne({ userId })
      const templates = [ ...user.templates, nextState ]
      await collection.updateOne({ userId }, new User({ ...user, templates }))
    }).catch((error) => {
      console.log(error)
    })
  }
  // createUser: (data) => {
  //   return this.connect((collection) => {
  //     console.log(data)
  //     collection.insert(data)
  //     console.log('\nDONE\n')
  //   })
  // }
}

module.exports = mlabService
