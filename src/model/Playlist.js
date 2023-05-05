const mongoose = require('mongoose')
const { getRandomNumber } = require('../helper/random')
const Schema = mongoose.Schema

const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user_id: mongoose.Types.ObjectId, // none: => user create
    thumbnail: {
        type: String,
        default: function () {
            const random = getRandomNumber(1, 4)
            return `../../assets/img/nord${random}.png`
        },
    },
    list_of_songs: {
        type: [mongoose.Types.ObjectId],
        default: [],
        ref: 'Song',
    },
})

module.exports = mongoose.model('Playlist', PlaylistSchema)
