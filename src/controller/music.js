const mongoose = require('mongoose')
const Album = require('../model/Album')
const Artist = require('../model/Artist')
const Song = require('../model/Song')
const User = require('../model/User')
const PlayList = require('../model/Playlist')
const View = require('../model/View')
const Notify = require('../model/Notify')
const Playlist = require('../model/Playlist')

exports.getAllSong = async (req, res) => {
    const songs = await Song.find({}).lean()

    return res.status(200).json({ success: 1, data: songs })
}

exports.getSong = async (req, res) => {
    const { id: song_id = '' } = req.params

    try {
        const song = await Song.findOne({ _id: song_id }).lean()

        if (!song) {
            return res.status(401).json({
                success: false,
                message: 'Song not found',
            })
        }

        return res.status(200).json({ success: true, data: song })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.getAlbum = async (req, res) => {
    const { id: album_id = '' } = req.params

    try {
        const album = await Album.findOne({ _id: album_id })
            .populate({
                path: 'artist',
                select: '_id name thumbnail',
                options: { strictPopulate: false },
            })
            .populate({
                path: 'song',
                select: '_id name audio_filepath thumbnail',
                options: { strictPopulate: false },
            })
            .lean()

        if (!album) {
            return res.status(401).json({
                success: false,
                message: 'Album not found',
            })
        }

        return res.status(200).json({ success: true, data: album })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.getArtist = async (req, res) => {
    const { id: artist_id = '' } = req.params

    try {
        const artist = await Artist.findOne({ _id: artist_id })
            .populate({
                path: 'song',
                select: '_id name thumbnail audio_filepath',
            })
            .lean()

        if (!artist) {
            return res.status(401).json({
                success: false,
                message: 'Album not found',
            })
        }

        return res.status(200).json({ success: true, data: artist })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

// transaction => them sau
exports.increaseView = async (req, res) => {
    try {
        const { id: song_id = '' } = req.params
        await Song.findOneAndUpdate({ _id: song_id }, { $inc: { view: 1 } })

        await View.create({
            song_id: song_id,
        })

        // await Promise.all([updateViewSong, updateView])

        return res.status(200).json({
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.updateSharedArtist = async (req, res) => {
    const { artist_id = '' } = req.body

    try {
        const artist = await Artist.findOneAndUpdate(
            { _id: artist_id },
            { $inc: { num_shared: 1 } }
        )

        if (!artist) {
            return res.status(401).json({
                success: false,
                message: 'Artist not found',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'update liked artist success',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.getTopSongFavorite = async (req, res) => {
    try {
        const top_song = await View.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
            },
            {
                $group: {
                    _id: '$_id',
                    favorite: { $sum: 1 },
                },
            },
            {
                $sort: {
                    favorite: -1,
                },
            },
            {
                $limit: 10,
            },
        ])
            .populate({
                path: 'song',
                select: '_id name thumbnail',
            })
            .lean()

        return res.status(200).json({
            success: true,
            message: 'get top song success',
            data: top_song,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.getAllNotify = async (req, res) => {
    try {
        const notify = await Notify.find({}).lean()
        return res.status(200).json({
            success: true,
            data: notify,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.getNotifyDetail = async (req, res) => {
    const { type = 'Player', id } = req.params

    try {
        let data = null
        if (type == 'Player') {
            data = await Song.findOne({ _id: id }).select('name audio_filepath').lean()
        } else if (type == 'TheAlbum') {
            data = await Album.findOne({ _id: id })
                .populate({
                    path: 'songs',
                    select: '_id name thumbnail audio_filepath',
                })
                .lean()
        } else {
            data = await Artist.findOne({ _id: id }).lean()
        }

        return res.status(200).json({ message: true, data })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.search = async (req, res) => {
    const { q = '' } = req.query

    try {
        const songs = Song.find({ $text: { $search: q } }).select('name')
        const artists = Artist.find({ $text: { $search: q } })
            .populate({
                path: 'song',
                select: 'name',
            })
            .select('name')

        const data = await Promise.all([songs, artists])

        return res.status(200).json({ message: true, data: data })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.getTopAlbum = async (req, res) => {
    try {
        const albums = await Album.find({})
            .select('name thumbnail song')
            .sort({ num_liked: -1 })
            .limit(6)
            .lean()

        return res.json({ success: true, data: albums })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.getTopArtist = async (req, res) => {
    try {
        const artists = await Artist.find({})
            .select('name thumbnail')
            .sort({ num_liked: -1 })
            .limit(6)
            .lean()

        return res.json({ success: true, data: artists })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.getSongFromPlaylist = async (req, res) => {
    const { id = '' } = req.params
    try {
        const songs = await PlayList.findOne({ _id: id }).populate({
            path: 'songs',
            select: 'name audio_filepath',
        }).select('songs').lean()

        return res.status(200).json({
            success: true,
            message: 'get song from playlist success',
            data: songs,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}
