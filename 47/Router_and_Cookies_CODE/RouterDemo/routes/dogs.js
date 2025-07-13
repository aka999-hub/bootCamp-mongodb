// Router_and_Cookies_CODE/RouterDemo/routes/dogs.js
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('all dogs')
})

router.get('/:id', (req, res) => {
    res.send('view dog')
})

router.get('/:id/edit', (req, res) => {
    res.send('edit dog')
})


module.exports = router