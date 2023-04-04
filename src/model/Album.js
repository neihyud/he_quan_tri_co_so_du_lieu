const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlbumSchema = new Schema({
    name: String,
    artist: String,
    song: {
        type: [mongoose.Types.ObjectId]
    },
    description: String,
    thumbnail: {
        type: String,
        default: require('../../assets/img/nord3.png')
    },
    num_liked: Number,
    num_shared: Number
})

module.exports = mongoose.model('Album', AlbumSchema)
