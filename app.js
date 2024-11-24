const express = require('express')
const path = require('path'); 
const mongoose = require('mongoose');
const CampgroundModel = require('./models/campground');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError');
const catchAsync = require('./utilities/catchAsync');
const methodOverride = require("method-override"); 
 
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

app.get('/', (req, res)=>{
    res.render('home');
})

app.get('/campgrounds', async (req, res)=>{
    const campgrounds = await CampgroundModel.find({});
    res.render('campgrounds/index', {campgrounds});
})

app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds', catchAsync(async(req, res, next)=>{
    const campground = new CampgroundModel(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id/edit', catchAsync(async(req, res)=>{
    const campground = await CampgroundModel.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', catchAsync(async(req, res)=>{
    const campground =await CampgroundModel.findOneAndUpdate({_id: req.params.id},{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id', catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await CampgroundModel.findById(id);
    res.render('campgrounds/show', { campground});
}))

app.delete('/campgrounds/:id', catchAsync(async(req, res)=>{
    await CampgroundModel.findOneAndDelete({_id: req.params.id});
    res.redirect('/campgrounds');
}))

app.all('*', (req, res, next)=>{
    throw new ExpressError('Page Not Found', 404);
})

app.use((err, req, res, next)=>{
    const{ message = 'somthing went wrong', statusCode = 500} = err;
    res.status(statusCode).send(message);
})

app.listen(3000, ()=>{
    console.log('i am listening...');
})