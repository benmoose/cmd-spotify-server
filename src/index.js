// Pull in .env variables
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')

const PORT = process.env.PORT || 3001
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// enable CORS from anyone
// should be taken from .env but that's not too important in this small app
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// version the api
app.use('/v1', routes)

app.listen(PORT, () => console.log(`listening on :${PORT}`))
