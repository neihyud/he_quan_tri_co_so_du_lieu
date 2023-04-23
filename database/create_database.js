const express = require('express')
const app = express()

const mongoose = require('mongoose')

const mongodb = require('../src/connection/mongodb')
const Artist = require('../src/model/Artist')
const Song = require('../src/model/Song')
const Album = require('../src/model/Album')
const Playlist = require('../src/model/Playlist')
const Notify = require('../src/model/Notify')
mongodb.connect()

app.use(express.json())

app.get('/', (req, rest) => {
    const song = new Ari({
        name: 'Toi nay di dau nhe',
        album: '99%',
        artist: {
            type: mongoose.Types.ObjectId,
            ref: 'Artist',
        },
        env: 'Rap',
        audio_filepath:
            'https://firebasestorage.googleapis.com/v0/b/music-app-2e474.appspot.com/o/01%2000%20Intro%20%20RPT%20MCK%20%2099%20the%20album.mp3?alt=media&token=6145a003-43f6-42bd-96b5-45cd95eb6452',
        view: 1,
    })
})

app.post('/artist', async (req, res) => {
    var id = new mongoose.Types.ObjectId()
    const artist = new Artist({
        ...req.body,
        song: [id],
    })
    try {
        const ar = await artist.save()
        console.log('ARR: ', ar._id)

        await new Song({
            _id: id,
            name: '01',
            artist: [ar._id],
            env: 'VN',
            audio_filepath:
                'https://firebasestorage.googleapis.com/v0/b/music-app-2e474.appspot.com/o/01%2000%20Intro%20%20RPT%20MCK%20%2099%20the%20album.mp3?alt=media&token=6145a003-43f6-42bd-96b5-45cd95eb6452',
            view: 1,
        }).save()
        return res.status(200).json({ messages: true, data: ar })
    } catch (error) {
        return res.status(200).json({ messages: false, error })
    }
})

app.post('/album', async (req, res) => {
    try {
        await new Album({
            ...req.body,
        }).save()
        return res.status.json({ success: true })
    } catch (error) {
        res.status(500).json({ messages: error })
    }
})

app.get('/playlist', async (req, res) => {
    const playlists = await Playlist.find({})
    res.json({ success: true, data: playlists })
})

app.post('/playlist', async (req, res) => {
    try {
        await new Playlist({
            ...req.body,
        }).save()

        return res.json({ success: true })
    } catch (error) {
        res.status(500).json({ messages: error })
    }
})

app.post('/notify', async (req, res) => {
    try {
        await new Notify({
            ...req.body,
        }).save()

        return res.json({ success: true })
    } catch (error) {
        res.status(500).json({ messages: error })
    }
})
app.listen(8081, () => console.log(`Listening on port 8081`))
