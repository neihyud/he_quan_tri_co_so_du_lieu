const express = require('express')
const job = require('./src/app')
var cors = require('cors')
const app = express()

const mongodb = require('./src/connection/mongodb')
mongodb.connect()

app.use(express.json())
app.use(cors())

const port = 8082

app.use('/', require('./src/app.routes'))

app.listen(port, () => console.log(`Listening on port ${port}`))
