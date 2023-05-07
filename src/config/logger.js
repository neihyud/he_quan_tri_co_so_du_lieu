const winston = require('winston')
const { createLogger, format } = winston
const { combine, timestamp, printf } = format

// Set up the MongoDB transport
require('winston-mongodb')
const mongoOptions = {
    level: 'info',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    collection: 'logs',
    db: process.env.MONGODB_URI,
    capped: true,
    cappedSize: 10485760,
    cappedMax: 10000,
}

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
})

const logger = createLogger({   
    format: combine(timestamp(), myFormat),
    transports: [
        new winston.transports.Console(),
        new winston.transports.MongoDB(mongoOptions),
    ],
})

module.exports = logger
