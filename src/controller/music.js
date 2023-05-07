const mongoose = require('mongoose')
const Album = require('../model/Album')
const Artist = require('../model/Artist')
const Song = require('../model/Song')
const PlayList = require('../model/Playlist')
const View = require('../model/View')
const Notify = require('../model/Notify')

exports.getAllSong = async (req, res) => {
    const songs = await Song.find({}).lean()

    return res.status(200).json({ success: true, data: songs })
}

exports.getSong = async (req, res) => {
    const { id: song_id = '' } = req.params

    try {
        const song = await Song.findOne({ _id: song_id })
            .select('-single')
            .populate({
                path: 'artist',
                select: 'name',
            })
            .lean()

        if (!song) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy bài hát ',
            })
        }

        return res.status(200).json({ success: true, data: song })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
            error,
        })
    }
}

exports.getAlbum = async (req, res) => {
    const { id: album_id = '' } = req.params

    try {
        const album = await Album.findOne({ _id: album_id })
            .populate({
                path: 'artist_id',
                select: '_id name artist',
            })
            .populate({
                path: 'list_of_songs',
                select: '_id title artwork url env',
            })
            .lean()

        if (!album) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy Album',
            })
        }

        return res.status(200).json({ success: true, data: { ...album } })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
            error,
        })
    }
}

exports.getArtist = async (req, res) => {
    const { id: artist_id = '' } = req.params

    try {
        const artist = await Artist.findOne({ _id: artist_id })
            .populate({
                path: 'list_of_songs',
                select: '_id title artwork url env',
            })
            .lean()

        if (!artist) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy Album',
            })
        }

        return res.status(200).json({ success: true, data: artist })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
            error,
        })
    }
}

exports.increaseView = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { id: song_id = '' } = req.params

        await Song.findOneAndUpdate(
            { _id: song_id },
            { $inc: { views: 1 } },
            { session }
        )

        const view = new View({
            song_id: song_id,
        })

        await view.save({ session })

        await session.commitTransaction()

        return res.status(200).json({
            success: true,
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
                message: 'Không tìm thấy nghệ sĩ',
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhập thích nghệ sĩ thành công ',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
            error,
        })
    }
}

exports.getTopSongFavorite = async (req, res) => {
    try {
        const top_song_vn = View.aggregate([
            {
                $lookup: {
                    from: 'songs',
                    localField: 'song_id',
                    foreignField: '_id',
                    as: 'song',
                },
            },
            {
                $unwind: '$song',
            },
            {
                $match: {
                    'song.env': 'vn',
                    createdAt: {
                        $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
            },
            {
                $group: {
                    _id: '$song_id',
                    view: { $sum: 1 },
                },
            },
            {
                $sort: {
                    view: -1,
                },
            },
            {
                $limit: 6,
            },
            {
                $lookup: {
                    from: 'songs',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'song',
                },
            },
            {
                $unwind: '$song',
            },
            {
                $lookup: {
                    from: 'artists',
                    localField: 'song.artist',
                    foreignField: '_id',
                    as: 'artist',
                },
            },
            {
                $project: {
                    title: '$song.title',
                    env: '$song.env',
                    artist: '$artist.name',
                    artwork: '$song.artwork',
                    url: '$song.url',
                },
            },
        ])

        const top_song_gb = View.aggregate([
            {
                $lookup: {
                    from: 'songs',
                    localField: 'song_id',
                    foreignField: '_id',
                    as: 'song',
                },
            },
            {
                $unwind: '$song',
            },
            {
                $match: {
                    'song.env': 'gb',
                    createdAt: {
                        $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
            },
            {
                $group: {
                    _id: '$song_id',
                    view: { $sum: 1 },
                },
            },
            {
                $sort: {
                    view: -1,
                },
            },
            {
                $limit: 6,
            },
            {
                $lookup: {
                    from: 'songs',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'song',
                },
            },
            {
                $unwind: '$song',
            },
            {
                $lookup: {
                    from: 'artists',
                    localField: 'song.artist_id',
                    foreignField: '_id',
                    as: 'artist',
                },
            },
            {
                $project: {
                    title: '$song.title',
                    env: '$song.env',
                    artist: '$artist.name',
                    artwork: '$song.artwork',
                    url: '$song.url',
                },
            },
        ])

        const [vn, gb] = await Promise.all([top_song_vn, top_song_gb])
        return res.status(200).json({
            success: true,
            message: 'Lấy top các bài hát thành công',
            data: [...vn, ...gb],
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
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
            message: 'Lỗi bên trong ',
            error,
        })
    }
}

exports.getNotifyDetail = async (req, res) => {
    const { type = 'Player', id = '' } = req.params

    try {
        let data = null
        if (type == 'Player') {
            data = await Song.findOne({ _id: id }).select('name url').lean()
        } else if (type == 'TheAlbum') {
            data = await Album.findOne({ _id: id })
                .populate({
                    path: 'list_of_songs',
                    select: '_id name thumbnail url',
                })
                .lean()
        } else {
            data = await Artist.findOne({ _id: id }).lean()
        }

        return res.status(200).json({ message: true, data })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
            error,
        })
    }
}

exports.search = async (req, res) => {
    const { q = '' } = req.query

    try {
        const songs = Song.find({ title: new RegExp(`^${q}`, 'i') })
            .select('title url artwork')
            .populate({ path: 'artist', select: 'name thumbnail' })
        const artists = Artist.find({ $text: { $search: q } })
            .populate({
                path: 'list_of_songs',
                select: 'title url artwork',
                populate: { path: 'artist', select: 'name thumbnail' },
            })
            .select('name thumbnail')

        const data = await Promise.all([songs, artists])

        return res.status(200).json({ success: true, data: data })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
            error,
        })
    }
}

exports.getTopAlbum = async (req, res) => {
    try {
        const albums = await Album.find({})
            .select('name thumbnail song')
            .populate({
                path: 'artist_id',
                select: 'name',
            })
            .sort({ num_liked: -1 })
            .limit(6)
            .lean()

        return res.json({ success: true, data: albums })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
            error,
        })
    }
}

exports.getTopArtist = async (req, res) => {
    try {
        const artists = await Artist.find({})
            .select('name thumbnail')
            .sort({ followers: -1 })
            .limit(6)
            .lean()

        return res.json({ success: true, data: artists })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
            error,
        })
    }
}

exports.getSongFromPlaylist = async (req, res) => {
    const { id = '' } = req.params
    try {
        const songs = await PlayList.findOne({ _id: id })
            .populate({
                path: 'list_of_songs',
                select: 'title url artwork artist',
                populate: {
                    path: 'artist',
                    select: 'name',
                },
            })
            .select('list_of_songs')
            .lean()

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách các bài hát từ Playlist thành công ',
            data: songs,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi bên trong ',
            error,
        })
    }
}
