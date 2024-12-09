const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError');
const catchAsync = require('./utilities/catchAsync');
const methodOverride = require("method-override");
const session = require('express-session');

const campgrounds = require('./routes/campground');
const reviews = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));
db.once('open', () =>{
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionCongig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true
}
app.use(session(sessionCongig));

app.use('/campgrounds', campgrounds);
app.use('/', reviews);


app.get('/', (req, res)=>{
    res.render('campgrounds/home');
})

app.all('*', (req, res)=>{
    throw new ExpressError('Page Not Found', 404);
})

app.use((err, req, res, next)=>{
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Somthing Went Wrong!'
    res.status(statusCode).render('partials/error', {err});
})

app.listen(3000, ()=>{
    console.log('i am listening...');
})