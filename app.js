const express = require('express')
const adminRouter = require('./routes/admin')
const shopRouter = require('./routes/shop')
const authRouter = require('./routes/auth')
const bodyParser = require('body-parser')
// const expresshbs = require("express-handlebars")
const path = require('path')
const error404 = require('./controllers/error')
// const {mongoConnect} = require('./util/database')
const User = require('./models/user')
const mongoose = require('mongoose')
const user = require('./models/user')
// const { use } = require('./routes/shop')
const session = require('express-session')
const { nextTick } = require('process')
const csurf = require('csurf')
const { readdirSync } = require('fs')
const MongoDBStore = require('connect-mongodb-session')(session)
const MONGO_URI = "mongodb+srv://admin:admin@cluster0.qfbbp.mongodb.net/shop?retryWrites=true&w=majority"
const flash = require('connect-flash')
const multer = require('multer')
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})
const filefilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const app = express()
const store = new MongoDBStore({
    uri: MONGO_URI,
    collection: 'sessions'
})
const csrfProtection = csurf()
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: false}))
app.use(multer({storage: fileStorage, fileFilter: filefilter}).single('image'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}))
app.use(csrfProtection)
// app.engine('hbs', expresshbs({layoutDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}))


app.use((req, res, next) => {
    // console.log(req.session.user)
    if(req.session.user === undefined || req.session.user === null) {
        // console.log(req.session.user)
        next()
    } else {
    User.findOne({email: req.session.user['email']})
    .then(user => {
        req.user = user
        // console.log('jhjhjj' ,user)
        next()
        }
        )
        .catch(err => console.log('app error',err))
    }
})
app.use(flash())
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})
app.use('/admin', adminRouter.routes)

app.use(shopRouter)
app.use(authRouter)


app.get('/500', error404.get500);
app.use(error404.get404)
app.use((error, req, res, next) => {
    // res.redirect('/500')
    // console.log(req, 'isLoggedIn')
    res.status(500).render('500', {
        docTitle: '500',
        path: '/500',
        isLoggedIn: req.session.isLoggedIn
    })
})
// mongoConnect(()=> {
//     // console.log(client)
//     app.listen(3000)
// })
mongoose.connect(MONGO_URI)
.then(result => {
    // User.findOne().then(user => {
    //     if(!user) {
    //         const user = new User({
    //             username: 'Christian',
    //             email: 'abiode23@gmail.com',
    //             cart: {
    //                 items: []
    //             }
    //         })
    //         user.save()
    //     }
    // })
    
    app.listen(3000)
    console.log('Connected ')
})
.catch(err => console.log(err))