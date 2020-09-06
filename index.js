const express = require('express')
const path = require('path')
const {engine} = require('express-edge')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
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

//Models
const Post = require('./database/models/Post')

const app = express()
mongoose.connect('mongodb://localhost/node-js-blog')

//Sessions
const mongoStore = connectMongo(expressSession)

app.use(expressSession({
    secret: 'secret',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}))



app.use(express.static('public'))
app.use(engine)
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const validateCreatePostMiddleware = require('./middleware/storePost')
const auth = require('./middleware/auth')
const storePost = require('./middleware/storePost')




app.set('views', `${__dirname}/views`);

app.get('/', homePageController)
app.get('/auth/register', createUserController)
app.get('/posts/new', auth, createPostController)
app.post('/posts/store', auth, storePost, storePostController)
app.get('/post/:id', getPostController)
app.get('/auth/login', loginController)
app.post('/users/register', storeUserController)
app.post('/users/login', loginUserController)

app.listen(4000, () => {
    console.log('App listening on port 4000!');
}); 