
require('dotenv').config()

var express = require('express')
var passport = require('passport')
var Strategy = require('passport-github').Strategy
// var path = require('path')

var db = require('./backend/repo')
// console.log(process.env.GITHUB_CLIENT_ID)
// console.log(process.env.GITHUB_CLIENT_SECRET)

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
    clientID: process.env['GITHUB_CLIENT_ID'],
    clientSecret: process.env['GITHUB_CLIENT_SECRET'],
    callbackURL: process.env.CALLBACK_URL || "http://localhost:8080/return"
    // callbackURL: '/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile)
  }))


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user)
})

passport.deserializeUser(function(obj, cb) {
  cb(null, obj)
})


// Create a new Express application.
var app = express()

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'))
app.use(require('cookie-parser')())
app.use(require('body-parser').json())
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize())
app.use(passport.session())


// app.use('/', express.static(path.join(__dirname, 'build')))
app.use('/', express.static('./build'))

// Define routes.
// app.get('/',
//   function(req, res) {
//     // res.render('home', { user: req.user })
//     res.end()
//   })

app.get('/login',
  function(req, res){
    res.send({ message: 'please login', status: 401 })
  })

app.get('/logout', function(req, res) {
  console.log('logging out...')
  req.logout()
  res.redirect('/')
})

app.get('/login/github',
  passport.authenticate('github'))

app.post('/user', async (req, res) => {
  await db.createUser(req.user.id).then((data) => {
    console.log(data)
    res.send({ status: 200, message: 'User is created' })
  })
})

app.get('/return', 
  passport.authenticate('github', { failureRedirect: '/login' }),
    async (req, res) => {
      await db.createUser(req.user.id).then((data) => {
        console.log(data)
      })
      res.redirect('/')
    }
  )

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    // res.render('profile', { user: req.user })
    res.send({ user: req.user })
  })

app.get('/user',
  require('connect-ensure-login').ensureLoggedIn(),
  async (req, res) => {
    console.log(req.user)
    await db.createUser(req.user.id).then((data) => {
      console.log(data)
      res.send({ message: 'user created' })
    })
    // await db.findUser(req.user.id).then((data) => {
    //   console.log(data)
    // })
  })

app.post(`/update/template`,
  require('connect-ensure-login').ensureLoggedIn(), 
  async (req, res) => {
    console.log('\n')
    console.log('CREATE_TEMPLATE')
    console.log('\n')
    db.createTemplate({
      userId: req.user.id,
      json: req.body.json,
      template:  req.body.template
    }).then((data) => {
      return res.send({
        message: `Created template for user ${req.user.username}`,
        data,
        status: 200
      })
    }).catch((error) => {
      return res.send({ error, status: 500 })
    })
  })

app.put(`/user/template/:guid`,
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    console.log(req.params)
    res.send({ message: `Updated template for user ${req.user.username}` })
  })

app.get('/api/json/:guid', (req, res) => {
  console.log(req.params.guid)
  return db.getTemplate({
    userId: req.user.id, templateId: req.params.guid
  }).then(({ json }) => {
    res.json(JSON.parse(json))
  })
})

app.get('/:guid',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    console.log(req.user)
    req.send({ message: `Get template for user ${req.user.username}` })
  })

app.listen(process.env['PORT'] || 8080)
