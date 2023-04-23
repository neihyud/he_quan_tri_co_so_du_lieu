const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ViewSchema = new Schema(
    {
        song_id: { type: mongoose.Types.ObjectId, ref: 'Song', required: true },
        expireAt: {
            type: Date,
            default: Date.now,
            index: { expires: '10080m' },
        },
    },

    { timestamps: true }
)

module.exports = mongoose.model('View', ViewSchema)
