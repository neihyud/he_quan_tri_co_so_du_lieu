const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ViewSchema = new Schema(
    {
        song_id: { type: mongoose.Types.ObjectId, ref: 'Song', required: true },
    },
    { timestamps: true }
)

module.exports = mongoose.model('View', ViewSchema)
