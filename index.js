const express = require('express')
const path = require('path')
const {engine} = require('express-edge')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')

//Controllers
const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homepage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require('./controllers/createUser')
const storeUserController = require('./controllers/storeUser')

//Models
const Post = require('./database/models/Post')

const app = express()

mongoose.connect('mongodb://localhost/node-js-blog')

app.use(express.static('public'))
app.use(engine)
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const validateCreatePostMiddleware = require('./middleware/storePost')

app.use('/posts/store', validateCreatePostMiddleware)

app.set('views', `${__dirname}/views`);

app.get('/', homePageController)
app.get('/auth/register', createUserController)
app.get('/posts/new', createPostController)
app.post('/posts/store', storePostController)
app.get('/post/:id', getPostController)

app.post('/users/register', storeUserController)
app.listen(4000, () => {
    console.log('App listening on port 4000!');
}); 