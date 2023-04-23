const mongoose = require('mongoose')
const { Schema } = mongoose;

const OtpEmailSchema = new Schema({
    email: String,
    user_id: String,
    otp: String,
    time: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('OtpEmail', OtpEmailSchema);;