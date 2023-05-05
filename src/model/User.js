const mongoose = require('mongoose')
const { getRandomNumber } = require('../helper/random')
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
        default: function () {
            const random = getRandomNumber(1, 4)
            return `../../assets/img/nord${random}.png`
        },
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
