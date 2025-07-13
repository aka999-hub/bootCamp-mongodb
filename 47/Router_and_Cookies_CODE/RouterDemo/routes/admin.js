// Router_and_Cookies_CODE/RouterDemo/routes/admin.js
const express = require('express')
const router = express.Router()

// ミドルウェア
router.use((req, res, next) => {
    if (req.query.isAdmin) {
        next()
    }
    res.send('Not Admin!!!')
})

router.get('/secret', (req, res) => {
    res.send('secret!!!!!')
})

router.get('/deleteall', (req, res) => {
    res.send('deleted all!!!')
})

module.exports = router
