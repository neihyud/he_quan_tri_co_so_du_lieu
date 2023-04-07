const Album = require('../model/Album')
const Artist = require('../model/Artist')
const Song = require('../model/Song')
const User = require('../model/User')
const PlayList = require('../model/Playlist')
const View = require('../model/View')

exports.getAllSong = async (req, res) => {
    const songs = await Song.find({}).lean()

    return res.status(200).json({ success: 1, data: songs })
}

exports.getSong = async (req, res) => {
    const { id: song_id = '' } = req.params

    try {
        const song = await Song.find({ _id: song_id }).lean()

        if (!song) {
            return res.status(401).json({
                success: false,
                message: 'Song not found',
            })
        }

        return res.status(200).json({ success: true, data: song })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.getAlbum = async (req, res) => {
    const { id: album_id = '' } = req.params

    try {
        const album = await Album.find({ _id: album_id }).lean()

        if (!album) {
            return res.status(401).json({
                success: false,
                message: 'Album not found',
            })
        }

        return res.status(200).json({ success: true, data: {} })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.getArtist = async (req, res) => {
    const { artist_id = '' } = req.params

    try {
        const artist = await Artist.find({ _id: artist_id }).lean()

        if (!artist) {
            return res.status(401).json({
                success: false,
                message: 'Album not found',
            })
        }

        return res.status(200).json({ success: true, data: artist })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.increaseView = async (req, res) => {
    try {
        const { id: song_id = '' } = req.params
        const updateViewSong = Song.findOneAndUpdate(
            { _id: song_id },
            { $inc: { view: 1 } }
        )

        const updateView = View.create({
            _id: song_id,
        })

        await Promise.all([updateViewSong, updateView])

        res.status(200).json({
            success: true,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.updateLikedArtist = async (req, res) => {
    const { user_id = '', artist_id = '' } = req.body

    const artist = await Artist.find({ _id: artist_id }).lean().select('_id')

    if (!artist) {
        return res.status(401).json({
            success: false,
            message: 'Artist not found',
        })
    }

    const user = await User.find({
        _id: user_id,
        favorite_artist: { $elemMatch: { _id: artist_id } },
    })

    if (user) {
        await User.updateOne(
            { _id: user_id },
            { $pullAll: { favorite_artist: [artist_id] } }
        )

        await Artist.updateOne({ _id: artist_id }, { $inc: { num_liked: -1 } })
    } else {
        await User.updateOne(
            { _id: user_id },
            { favorite_artist: [...favorite_artist, artist_id] }
        )

        await Artist.updateOne({ _id: artist_id }, { $inc: { num_liked: 1 } })
    }

    res.status(200).json({
        success: true,
        message: 'update liked artist success',
    })
}

exports.updateSharedArtist = async (req, res) => {
    const { artist_id = '' } = req.params

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

        res.status(200).json({
            success: true,
            message: 'update liked artist success',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

// them playlist yeu thich
exports.addPlaylist = async (req, res) => {
    const { user_id = '', playlist_id = '' } = req.body

    const playlist = await User.findOneAndUpdate(
        { _id: user_id },
        { playlist: [...playlist, playlist_id] }
    )

    if (!playlist) {
        return res.status(401).json({
            success: false,
            message: 'Playlist not found',
        })
    }

    res.status(200).json({
        success: true,
        message: 'update playlist success',
    })
}

exports.createPlaylistUser = async (req, res) => {}

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
                path: 'Song',
                select: '_id name thumbnail',
            })
            .lean()

        res.status(200).json({
            success: true,
            message: 'get top song success',
            data: top_song,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}
