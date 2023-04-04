const dotenv = require('dotenv')
dotenv.config()

const config = {
    mongodbUri: process.env.MONGODB_URI || "mongodb://172.17.0.2:27017/music_app"
}

module.exports = { config }