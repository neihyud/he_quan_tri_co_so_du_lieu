const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlbumSchema = new Schema({
    name: String,
    artist: {
        type: [mongoose.Types.ObjectId],
        ref: "Artist"        
    },
    song: {
        type: [mongoose.Types.ObjectId],
        ref: 'Song',
    },
    description: String,
    thumbnail: {
        type: String,
        default: require('../../assets/img/nord3.png'),
    },
    num_liked: Number,
    num_shared: Number,
})

module.exports = mongoose.model('Album', AlbumSchema)
