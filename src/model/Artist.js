const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArtistSchema = new Schema({
    name: {
        type: String,
    },
    description: String,
    thumbnail: {
        type: String,
        default: '../../assets/img/n.png',
    },
    song: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Song',
        },
    ],
    num_liked: Number,
    num_shared: Number,
})

ArtistSchema.index({ name: 'text' })

module.exports = mongoose.model('Artist', ArtistSchema)
