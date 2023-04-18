const express = require('express')
const router = express.Router()
const verifyToken = require('../src/middleware/auth')

// Auth
const authController = require('./controller/auth')
router.post('/login', authController.loginUser)
router.post('/register', authController.registerUser)

const music = require('../src/controller/music')

// get all song => hien thi tat ca cac bai hat
router.get('/song', music.getAllSong)

// can add transaction
router.get('/song/top', music.getTopSongFavorite)

// tang view khi clice vao nghe
router.get('/song/:id/increase-view', music.increaseView)

// get song cu the
router.get('/song/:id', music.getSong)

// get album
router.get('/album/:id', music.getAlbum)

// get artist
router.get('/artist/:id', music.getArtist)

// tat ca thong bao hien thi
// type: kieu 'song' => link bai hat
//              'album => link album
router.get('/notify', music.getAllNotify)

// lay thong tin chi tiet ve hat hat or album
router.get('/notify/:type/:id', music.getNotifyDetail)

// khi nguoi dung like nghe si ho yeu thich thi se tang luot thich cua nghe si
// va luu nghe si yeu thich cho ng dung
router.post('/artist/liked', music.updateLikedArtist)

// khi ng dung click vao chuc nang share
router.post('/artist/shared', music.updateSharedArtist)

// them mot playlist (co san ) vao danh sach playlist yeu thich
router.post('/user/add-playlist', music.addPlaylistFavorite)

// user create playlist
router.post('/user/playlist', music.createPlaylistUser)


// search
router.get('/search', music.search)

module.exports = router
