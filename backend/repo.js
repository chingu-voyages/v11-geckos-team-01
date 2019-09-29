
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
  id: String,
  result: String,
  template: String,
  createdOn: String,
  updatedOn: String
})

const User = mongoose.model('User', userSchema)
const Template = mongoose.model('Template', templateSchema)

const connect = async (data) => {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db('json-generator')
    return db.collection('users')
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
        collection.insertOne(new User({ userId, template: [] }))
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
