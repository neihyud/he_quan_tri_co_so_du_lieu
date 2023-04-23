const Album = require('../model/Album')
const Artist = require('../model/Artist')
const Song = require('../model/Song')
const User = require('../model/User')
const PlayList = require('../model/Playlist')
const View = require('../model/View')
const Notify = require('../model/Notify')
const Playlist = require('../model/Playlist')

exports.getUserFavorite = async (req, res) => {
    const { favorite_song = [] } = req.body

    try {
        const songs = await Song.find({
            _id: { $in: favorite_song },
        })
            .select('name')
            .lean()

        res.json({ success: true, data: songs })
    } catch (error) {
        res.json({ success: false, message: 'Server error' })
    }
}

exports.getUserPlaylist = async (req, res) => {
    const { playlist = [] } = req.body

    try {
        const songs = await PlayList.find({
            _id: { $in: favorite_song },
        })
            .select('name user_id')
            .lean()

        res.json({ success: true, data: songs })
    } catch (error) {
        res.json({ success: false, message: 'Server error' })
    }
}

exports.addSongToPlaylist = async (req, res) => {
    const { user_id = '', song_id = '', playlist_id = '' } = req.body

    try {
        const playlist = await PlayList.findOneAndUpdate(
            { _id: playlist_id, user_id: user_id },
            {
                $push: {
                    song: song_id,
                },
            }
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
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' })
    }
}

exports.createPlaylistUser = async (req, res) => {
    const { user_id = '', playlist_name = '' } = req.body

    try {
        const user = await User.find({ id: user_id }).lean()

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            })
        }

        const playlist = new Playlist({
            name: playlist_name,
            user_id: user_id,
        })

        await playlist.save()

        return res.status(200).json({
            success: true,
            message: 'create playlist user success',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}

exports.addPlaylistFavorite = async (req, res) => {
    const { user_id = '', playlist_id = '' } = req.body

    const playlist = await User.findOneAndUpdate(
        { _id: user_id },
        {
            $push: {
                playlist: playlist_id,
            },
        }
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

exports.updateLikedArtist = async (req, res) => {
    const { user_id = '', artist_id = '' } = req.body

    const artist = await Artist.findOne({ _id: artist_id }).lean().select('_id')

    if (!artist) {
        return res.status(401).json({
            success: false,
            message: 'Artist not found',
        })
    }

    const user = await User.findOne({
        _id: user_id,
        favorite_artist: artist_id,
    })

    if (user) {
        await User.updateOne(
            { _id: user_id },
            { $pull: { favorite_artist: artist_id } }
        )

        await Artist.updateOne({ _id: artist_id }, { $inc: { num_liked: -1 } })
    } else {
        await User.updateOne(
            { _id: user_id },
            {
                $push: {
                    favorite_artist: artist_id,
                },
            }
        )

        await Artist.updateOne({ _id: artist_id }, { $inc: { num_liked: 1 } })
    }

    res.status(200).json({
        success: true,
        message: 'update liked artist success',
    })
}

exports.deleteSongPlaylist = async (req, res) => {
    const { user_id = '', playlist_id = '', song_id = '' } = req.body

    try {
        const playlist = await PlayList.findOneAndUpdate(
            { _id: playlist_id, user_id: user_id },
            {
                $pull: {
                    songs: song_id,
                },
            }
        )

        if (!playlist) {
            res.status(400).json({
                success: false,
                message: 'Playlist not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'remove success',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Error',
            error,
        })
    }
}
