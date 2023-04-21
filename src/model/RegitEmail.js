const mongoose = require('./database');
const { Schema } = mongoose;

const RegitEmailSchema = new Schema({
    email: String,
    id_user: String,
    otp: String,
    time: {
        type: Date,
        default: Date.now()
    }
})

const regitEmail = mongoose.model('RegitEmail', regitEmailSchema);
module.exports = regitEmail;