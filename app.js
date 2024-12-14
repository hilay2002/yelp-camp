if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError');
const catchAsync = require('./utilities/catchAsync');
const methodOverride = require("method-override");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');

const campgroundsRoute = require('./routes/campground');
const reviewsRoute = require('./routes/reviews');
const usersRoute = require('./routes/user');
 
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


<<<<<<< HEAD
=======
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
>>>>>>> 4f9191b6e2e1d1414c19c3e6889a2b6ba514329e

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currntUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgroundsRoute);
app.use('/', reviewsRoute);
app.use('/', usersRoute);

app.get('/', (req, res)=>{
    res.render('campgrounds/home');
})

app.all('*', (req, res)=>{
    throw new ExpressError('Page Not Found', 404);
})
 
app.use((err, req, res, next)=>{
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Somthing Went Wrong!'
    res.status(statusCode).render('partials/error', {err});
})

app.listen(3000, ()=>{
    console.log('i am listening...');
})