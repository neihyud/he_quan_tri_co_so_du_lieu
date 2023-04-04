const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArtistSchema = new Schema({
    name: String,
    description: String, 
    thumbnail: {
        type: String,
        default: require('../../assets/img/nord3.png')
    },
    song: [mongoose.Types.Schema],
    num_liked: Number,
    num_shared: Number,
})

module.exports = mongoose.model('Artist', ArtistSchema)
