const mongoose = require('mongoose')
const { getRandomNumber } = require('../helper/random')
const Schema = mongoose.Schema

const AlbumSchema = new Schema({
    name: String,
    artist_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Artist',
    },
    list_of_songs: {
        type: [mongoose.Types.ObjectId],
        ref: 'Song',
    },
    description: String,
    thumbnail: {
        type: String,
        default: function () {
            const random = getRandomNumber(1, 4)
            return `../../assets/img/nord${random}.png`
        },
    },
    num_liked: {
        type: Number,
        default: 0,
    },
    num_shared: {
        type: Number,
        default: 0,
    },
})

module.exports = mongoose.model('Album', AlbumSchema)
