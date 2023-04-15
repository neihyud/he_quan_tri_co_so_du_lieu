const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SongSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    album: {
        type: String,
    },
    thumbnail: {
        type: String,
        default: '../../assets/img/n.png',
    },
    artist: {
        type: [mongoose.Types.ObjectId],
        ref: 'Artist',
    },
    env: String,
    audio_filepath: String,
    lyric: String,
    view: Number,
})

module.exports = mongoose.model('Song', SongSchema)
