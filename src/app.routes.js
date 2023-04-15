const express = require('express')
const router = express.Router()
const verifyToken = require('../src/middleware/auth')

// Auth
const authController = require('./controller/auth')
router.post('/login', authController.loginUser)
router.post('/register', authController.registerUser)

const music = require('../src/controller/music')

router.get('/song', music.getAllSong)

// can add transaction
router.get('/song/:id/increase-view', music.increaseView)

router.get('/song/top', music.getTopSongFavorite)

router.get('/song/:id', music.getSong)
router.get('/album/:id', music.getAlbum)
router.get('/artist/:id', music.getArtist)
router.post('/artist/liked', music.updateLikedArtist)
router.post('/artist/shared', music.updateSharedArtist)
router.post('/user/add-playlist', music.addPlaylistFavorite)

module.exports = router
