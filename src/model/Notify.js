const mongoose = require('mongoose')
const Schema = mongoose.Schema

    const NotifySchema = new Schema({
        title: {
            type: String,
            required: true,
        },
        description: String,
        navigation_link: {
            type: String,
            enum: ['Player','TheAlbum', 'TheArtist'],
            default: 'Player'
        },
        id_object: mongoose.Types.ObjectId
    })

module.exports = mongoose.model('Notify', NotifySchema)
