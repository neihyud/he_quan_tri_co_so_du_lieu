const Album = require('../model/Album')
const Artist = require('../model/Artist')
const Song = require('../model/Song')
const User = require('../model/User')
const PlayList = require('../model/Playlist')
const Playlist = require('../model/Playlist')
const { default: mongoose } = require('mongoose')
const logger = require('../config/logger')

exports.getUserFavorite = async (req, res) => {
    const { id: user_id = '' } = req.params

    try {
        const songs = await User.findOne({
            _id: user_id,
        })
            .populate({
                path: 'favorite_song',
                select: 'title url artwork',
            })
            .select('favorite_song')
            .lean()

        logger.info('lấy các bài hát yêu thích thành công của user thành công')

        return res.json({ success: true, data: songs })
    } catch (error) {
        return res.json({ success: false, message: 'Lỗi bên trong ' })
    }
}

exports.getUserPlaylist = async (req, res) => {
    const { id: user_id = '' } = req.params

    try {
        // const songs = await User.find({
        //     _id: { $in: playlist },
        // })
        //     .select('name user_id')
        //     .lean()

        const songs = await User.findOne({ _id: user_id })
            .populate({
                path: 'playlist',
                select: 'name thumbnail list_of_songs',
                populate: {
                    path: 'list_of_songs',
                    select: '_id',
                },
            })
            .lean()

        // const songs = User.aggregate([
        //     // Match user with given id
        //     { $match: { _id: user_id } },
        //     // Join playlists and unwind resulting array
        //     {
        //         $lookup: {
        //             from: 'playlists',
        //             localField: 'playlist',
        //             foreignField: '_id',
        //             as: 'playlists',
        //         },
        //     },
        //     { $unwind: '$playlists' },
        //     // Group playlists by name and count number of songs in each
        //     {
        //         $group: {
        //             _id: '$playlists.name',
        //             numSongs: { $sum: { $size: '$playlists.list_of_songs' } },
        //         },
        //     },
        //     // Project the playlist name and song count as an object
        //     {
        //         $project: {
        //             _id: 0,
        //             name: '$_id',
        //             numSongs: 1,
        //         },
        //     },
        // ])

        return res.json({ success: true, data: songs })
    } catch (error) {
        return res.json({ success: false, message: 'Lỗi bên trong ' })
    }
}

exports.addSongToPlaylist = async (req, res) => {
    const { user_id = '', song_id = '', playlist_id = '' } = req.body

    try {
        const playlist = await PlayList.findOneAndUpdate(
            {
                _id: playlist_id,
                user_id: user_id,
                list_of_songs: { $nin: [song_id] },
            },
            {
                $push: {
                    list_of_songs: song_id,
                },
            }
        )

        if (!playlist) {
            return res.status(401).json({
                success: false,
                message: 'Bài hát đã có trong playlist',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhập playlist thành công',
        })
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Lỗi bên trong ' })
    }
}

exports.createPlaylistUser = async (req, res) => {
    const { user_id = '', playlist_name = '' } = req.body
    if (!user_id || !playlist_name) {
        return res.status(401).json({
            success: false,
            message: 'Không tìm thấy User',
        })
    }
    try {
        const user = await User.findOne({ _id: user_id }).lean()

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy User',
            })
        }

        const playlist = new Playlist({
            name: playlist_name,
            user_id: user_id,
        })

        await playlist.save()

        return res.status(200).json({
            success: true,
            message: 'Tạo playlist thành công',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
            error,
        })
    }
}

exports.addPlaylistFavorite = async (req, res) => {
    const { user_id = '', playlist_id = '' } = req.body

    const playlist = await User.findOneAndUpdate(
        { _id: user_id, playlist: { $nin: [playlist_id] } },
        {
            $push: {
                playlist: playlist_id,
            },
        }
    )

    if (!playlist) {
        return res.status(401).json({
            success: false,
            message: 'Playlist đã có trong danh sách yêu thích',
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Cập nhập playlist thành công',
    })
}

exports.updateLikedArtist = async (req, res) => {
    const { user_id = '', artist_id = '' } = req.body

    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const artist = await Artist.findOne({ _id: artist_id })
            .lean()
            .select('_id')
        if (!artist) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy nghệ sĩ',
            })
        }

        const user = await User.findOne({
            _id: user_id,
            favorite_artist: artist_id,
        })

        if (user) {
            await User.updateOne(
                { _id: user_id },
                { $pull: { favorite_artist: artist_id } },
                { session }
            )

            await Artist.updateOne(
                { _id: artist_id },
                { $inc: { followers: -1 } },
                { session }
            )
        } else {
            await User.updateOne(
                { _id: user_id },
                {
                    $push: {
                        favorite_artist: artist_id,
                    },
                },
                { session }
            )

            await Artist.updateOne(
                { _id: artist_id },
                { $inc: { followers: 1 } },
                { session }
            )
        }

        await session.commitTransaction()

        return res.status(200).json({
            success: true,
            message: 'Cập nhập thích artist thành công ',
        })
    } catch (error) {
        await session.abortTransaction()
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
            error,
        })
    } finally {
        session.endSession()
    }
}

exports.deleteSongPlaylist = async (req, res) => {
    const { user_id = '', playlist_id = '', song_id = '' } = req.body

    try {
        const playlist = await PlayList.findOneAndUpdate(
            { _id: playlist_id, user_id: user_id },
            {
                $pull: {
                    list_of_songs: song_id,
                },
            }
        )

        if (!playlist) {
            return res.status(400).json({
                success: false,
                message: 'Không tìm thấy Playlist',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Xóa bài hát trong playlist thành công',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
            error,
        })
    }
}
