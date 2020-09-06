const express = require('express')
const path = require('path')
const {engine} = require('express-edge')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const Post = require('./database/models/Post')

const app = express()



mongoose.connect('mongodb://localhost/node-js-blog')

app.use(express.static('public'))
app.use(engine)
app.use(fileUpload())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', `${__dirname}/views`);

app.get('/', async (req,res) => {
    const posts = await Post.find({})
    console.log(posts)
    res.render('index', {
        posts
    }) 
})
app.get('/posts/new', (req, res) =>
{
    res.render('create')
})

app.post('/posts/store', (req,res) => {
    const { image } = req.files
    image.mv(path.resolve(__dirname,'public/posts', image.name), (error) => {
        Post.create(req.body, (error, post) => {
            res.redirect('/')
        })
    })
    
 
})

app.get('/about',(req,res) => {
    res.render('about')
})

app.get('/post/:id', async (req,res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
})

app.get('/contact',(req,res) => {
    res.render('contact')
})


app.listen(4000, () => {
    console.log('App listening on port 4000!');
});