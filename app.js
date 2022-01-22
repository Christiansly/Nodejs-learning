const express = require('express')
const adminRouter = require('./routes/admin')
const shopRouter = require('./routes/shop')
const bodyParser = require('body-parser')
// const expresshbs = require("express-handlebars")
const path = require('path')
const error404 = require('./controllers/error')
// const {mongoConnect} = require('./util/database')
const User = require('./models/user')
const mongoose = require('mongoose')
const user = require('./models/user')
const { use } = require('./routes/shop')


const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

// app.engine('hbs', expresshbs({layoutDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}))

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use((req, res, next) => {
    User.findById("61eb36deb03a84a967accf51").then(user => {
        req.user = user
        next()}
        ).catch(err => console.log(err))
    
})
app.use('/admin', adminRouter.routes)

app.use(shopRouter)

app.use(error404.get404)

// mongoConnect(()=> {
//     // console.log(client)
//     app.listen(3000)
// })
mongoose.connect("mongodb+srv://admin:admin@cluster0.qfbbp.mongodb.net/shop?retryWrites=true&w=majority")
.then(result => {
    User.findOne().then(user => {
        if(!user) {
            const user = new User({
                username: 'Christian',
                email: 'abiode23@gmail.com',
                cart: {
                    items: []
                }
            })
            user.save()
        }
    })
    
    app.listen(3000)
    console.log('Connected ')
})
.catch(err => console.log(err))