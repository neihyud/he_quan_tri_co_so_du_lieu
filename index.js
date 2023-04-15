const express = require('express')
const app = express()

const mongodb = require('./src/connection/mongodb')
mongodb.connect()

app.use(express.json())

const port = 8080

app.use('/', require('./src/app.routes'))

app.listen(port, () => console.log(`Listening on port ${port}`))
