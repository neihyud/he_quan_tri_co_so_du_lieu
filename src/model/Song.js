const mongoose = require('mongoose')
const { getRandomNumber } = require('../helper/random')
const Schema = mongoose.Schema

const SongSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    album: {
        type: String,
    },
    single: String,
    artwork: {
        type: String,
        default: function () {
            const random = getRandomNumber(1, 4)
            return `../../assets/img/nord${random}.png`
        },
    },
    artist: {
        type: [mongoose.Types.ObjectId],
        ref: 'Artist',
    },
    env: String,
    url: String,
    lyric: String,
    views: Number,
})

SongSchema.index({ name: 'text' })

module.exports = mongoose.model('Song', SongSchema)
