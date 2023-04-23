const mongoose = require('mongoose')
const { Schema } = mongoose

const OtpEmailSchema = new Schema({
    email: String,
    user_id: String,
    otp: String,
    time: {
        type: Date,
        default: Date.now(),
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: '10m' },
    },
})

module.exports = mongoose.model('OtpEmail', OtpEmailSchema)
