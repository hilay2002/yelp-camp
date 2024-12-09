const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const CampgroundModel = require('../models/campground');
const { campgroundSchema } = require('../schemas');



const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body , { abortEarly: false });
    if(error) {
        const msg = error.details.map( o => o.message).join(',');
        throw new ExpressError( msg, 400);
    }else{
        next();
    }
}

router.get('/', async (req, res)=>{
    const campgrounds = await CampgroundModel.find({});
    res.render('campgrounds/index', {campgrounds});
})

router.get('/new', (req, res)=>{
    res.render('campgrounds/new')
})

router.post('/', validateCampground, catchAsync(async(req, res, next)=>{
    const campground = new CampgroundModel(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id/edit', catchAsync(async(req, res)=>{
    const campground = await CampgroundModel.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id',validateCampground, catchAsync(async(req, res)=>{
    const campground =await CampgroundModel.findOneAndUpdate({_id: req.params.id},{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync(async (req, res)=>{
    const { id } = req.params;
    const campground = await CampgroundModel.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground});
}))

router.delete('/:id', catchAsync(async(req, res)=>{
    await CampgroundModel.findOneAndDelete({_id: req.params.id});
    res.redirect('/campgrounds');
}))

module.exports = router;