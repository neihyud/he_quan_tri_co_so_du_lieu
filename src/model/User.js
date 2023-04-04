const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        default: 'User',
    },
    email: {
        type: String,
        require: true,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: require('../../assets/img/nord3.png'),
    },
    favorite_song: {
        type: [mongoose.Types.ObjectId],
        ref: 'Song',
    },
    playlist: {
        type: [mongoose.Types.ObjectId],
        ref: 'Playlist',
    },
    favorite_artist: {
        type: [mongoose.Types.ObjectId],
        ref: 'Artist',
    },
})

module.exports = mongoose.model('User', UserSchema)
