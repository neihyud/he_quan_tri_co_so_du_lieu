const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.json({ success: 1 })
})

module.exports = router