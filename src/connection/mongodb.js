const mongoose = require('mongoose')
const { config } = require('../config/index')

const connect = async () => {
    try { 
        await mongoose.connect(config.mongodbUri)
        console.log('MongoDb connect success!')
    } catch (error) {
        console.log('MongoDb connect fail: ', error)
    }
}

module.exports = { connect }
