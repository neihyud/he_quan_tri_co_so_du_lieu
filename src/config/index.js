const dotenv = require('dotenv')
dotenv.config()

const config = {
    mongodbUri:
        process.env.MONGODB_URI || 'mongodb://172.17.0.2:27017/music_app',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'secret',
}

module.exports = { config }
