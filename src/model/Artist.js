const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArtistSchema = new Schema({
    name: {
        type: String,
    },
    about: String,
    thumbnail: {
        type: String,
        default: '../../assets/img/n.png',
    },
    list_of_songs: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Song',
        },
    ],
    followers: Number,
    num_shared: Number,
})

ArtistSchema.index({ name: 'text' })

module.exports = mongoose.model('Artist', ArtistSchema)
