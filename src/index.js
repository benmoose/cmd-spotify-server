// Pull in .env variables
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')

const PORT = process.env.PORT || 3001
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/v1', routes)

app.listen(PORT, () => console.log(`listening on :${PORT}`))
