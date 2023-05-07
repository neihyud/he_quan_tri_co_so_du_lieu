const mongoose = require('mongoose')
const { config } = require('../config/index')
const logger = require('../config/logger')
const connect = async () => {
    try {
        await mongoose.connect(config.mongodbUri)
        logger.info('MongoDb connect success!')
        console.log('MongoDb connect success!')
    } catch (error) {
        console.log('MongoDb connect fail: ', error)
    }
}

module.exports = { connect }
