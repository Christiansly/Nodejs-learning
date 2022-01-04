const express = require('express')
const adminRouter = require('./routes/admin')
const shopRouter = require('./routes/shop')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'pug')
app.set('views', 'views')
app.use('/admin', adminRouter.routes)

app.use(shopRouter)

app.use((req, res) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
    res.render('404', {docTitle: "404 - Page not found"})
})

app.listen(3000)
