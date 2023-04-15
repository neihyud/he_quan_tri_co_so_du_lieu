const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotifySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: String,
    type_notify: {
        type: String,
        enum: ['song','album'],
        default: 'song'
    },
    type_id: mongoose.Types.ObjectId
})

module.exports = mongoose.model('Notify', NotifySchema)
