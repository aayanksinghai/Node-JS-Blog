require('dotenv').config()
const express = require('express')
const path = require('path')
const {engine} = require('express-edge')
const edge = require('edge.js')
const cloudinary = require('cloudinary')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const connectFlash = require('connect-flash')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')

//Controllers
const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homepage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require('./controllers/createUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logoutController')


//Models
const Post = require('./database/models/Post')

const app = express()
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

app.use(connectFlash())

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_NAME
})

//Sessions
const mongoStore = connectMongo(expressSession)

app.use(expressSession({
    secret: process.env.EXPRESS_SESSION_KEY,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}))



app.use(express.static('public'))
app.use(engine)
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//Custom Middlewares
const validateCreatePostMiddleware = require('./middleware/storePost')
const auth = require('./middleware/auth')
const storePost = require('./middleware/storePost')
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')




app.set('views', `${__dirname}/views`);


app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
})

app.get('/', homePageController)
app.get('/auth/register', redirectIfAuthenticated, createUserController)
app.get('/posts/new', auth, createPostController)
app.get('/auth/logout', auth, logoutController)
app.post('/posts/store', auth, storePost, storePostController)
app.get('/post/:id', getPostController)
app.get('/auth/login',redirectIfAuthenticated, loginController)
app.post('/users/register', redirectIfAuthenticated, storeUserController)
app.post('/users/login', redirectIfAuthenticated, loginUserController)

// 404 Page
app.use((req, res) => res.render('not-found'))

const server = app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
}); 

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    //Close server & exit process
    server.close(() => process.exit(1))
})