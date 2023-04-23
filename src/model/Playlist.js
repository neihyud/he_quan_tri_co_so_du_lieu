const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user_id: mongoose.Types.ObjectId, // none: => user create
    thumbnail: {
        type: String,
        default: '../../assets/img/n.png',
    },
    songs: {
        type: [mongoose.Types.ObjectId],
        default: [],
        ref: 'Song',
    },
})

module.exports = mongoose.model('Playlist', PlaylistSchema)
