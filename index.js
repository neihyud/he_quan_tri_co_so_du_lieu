const express = require('express')
// const job = require('./src/app')
const dotenv = require('dotenv')
dotenv.config()
var cors = require('cors')
const logger = require('./src/config/logger')
const app = express()

const mongodb = require('./src/connection/mongodb')
mongodb.connect()

app.use(express.json())
app.use(cors())

const port = 8082

// app.use((req, res, next) => {
//     logger.info(req.body)
//     let oldSend = res.send
//     res.send = function (data) {
//         logger.info(JSON.parse(data))
//         oldSend.apply(res, arguments)
//     }
//     next()
// })

app.use('/', require('./src/app.routes'))

app.listen(port, () => console.log(`Listening on port ${port}`))
