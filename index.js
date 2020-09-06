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

//Models
const Post = require('./database/models/Post')

const app = express()

mongoose.connect('mongodb://localhost/node-js-blog')

app.use(express.static('public'))
app.use(engine)
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const validateCreatePostMiddleware = (req, res, next) => {
    if(!(req.files && req.files.image) || !req.body.username || !req.body.title || !req.body.subtitle || !req.body.content)
    {
        return res.redirect('/posts/new')
    }
    next()
}

app.use('/posts/store', validateCreatePostMiddleware)

app.set('views', `${__dirname}/views`);

app.get('/', homePageController)
app.get('/posts/new', createPostController)
app.post('/posts/store', storePostController)
app.get('/post/:id', getPostController)

app.listen(4000, () => {
    console.log('App listening on port 4000!');
});