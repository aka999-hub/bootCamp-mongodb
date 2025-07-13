// Router_and_Cookies_CODE/RouterDemo/index.js
const express = require('express')
const app = express()
const shelterRoutes = require('./routes/shelters')
const dogRoutes = require('./routes/dogs')
const adminRoutes = require('./routes/admin')



app.use('/shelters', shelterRoutes)
app.use('/dogs', dogRoutes)
app.use('/admin', adminRoutes)

app.listen(3000, () => {
    console.log('ポート3000でリクエスト受付中...')
})

