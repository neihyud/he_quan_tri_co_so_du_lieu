const express = require('express')
const router = express.Router()
const verifyToken = require('../src/middleware/auth')

// Auth
const authController = require('./controller/auth')
router.post('/login', authController.loginUser)
router.post('/register', authController.registerUser)
router.post('/forget-password', authController.forgetPassword)

router.post('/change-password', authController.changePassword)
router.post('/otp', authController.checkOtpEmail)
router.post('/reset-password', authController.resetPassword)

// ==================
const music = require('../src/controller/music')
const user = require('../src/controller/user')

// get all song => hien thi tat ca cac bai hat
router.get('/song', music.getAllSong)

router.get('/song/top', music.getTopSongFavorite)

router.get('/album/top', music.getTopAlbum)

router.get('/artist/top', music.getTopArtist)

// tang view khi click vao nghe
router.put('/song/:id/increase-view', music.increaseView)

// get song cu the
router.get('/song/:id', music.getSong)

// get album
router.get('/album/:id', music.getAlbum)

// get artist
router.get('/artist/:id', music.getArtist)

// tat ca thong bao hien thi
router.get('/notify', music.getAllNotify)

// lay thong tin chi tiet ve hat hat or album
router.get('/notify/:type/:id', music.getNotifyDetail)

// khi ng dung click vao chuc nang share
router.put('/artist/shared', music.updateSharedArtist)

// khi nguoi dung like nghe si ho yeu thich thi se tang luot thich cua nghe si
// va luu nghe si yeu thich cho ng dung
router.put('/user/liked', user.updateLikedArtist)

// USER
// them mot playlist (co san ) vao danh sach playlist yeu thich
router.put('/user/add-playlist', user.addPlaylistFavorite)

// add song to playlist
router.put('/user/playlist/add-song', user.addSongToPlaylist)
router.put('/user/favorite/add-song', user.addSongToFavorite)

// user create playlist
router.post('/user/playlist', user.createPlaylistUser)

// user favorite
router.get('/user/:id/favorite-song', user.getUserFavorite)

router.post('/user/delete-song-from-playlist', user.deleteSongPlaylist)

// user playlist
router.get('/user/:id/get-playlist', user.getUserPlaylist)

// search
router.get('/search', music.search)

router.get('/playlist/:id', music.getSongFromPlaylist)
router.delete('/user/:userId/playlist/:playlistId', user.deletePlaylistFromUser)

module.exports = router
