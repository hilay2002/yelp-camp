const express = require('express');
const router = express.Router();
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');
const { reviewSchema } = require('../schemas');
const Review = require('../models/review');
const CampgroundModel = require('../models/campground');



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body , { abortEarly: false });
    if(error) {
        const msg = error.details.map( o => o.message).join(',');
        throw new ExpressError( msg, 400);
    }else{
        next();
    }
}

router.post('/campgrounds/:id/review',validateReview, catchAsync(async (req, res) =>{
    const campground = await CampgroundModel.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/campgrounds/:id/reviews/:reviewId', catchAsync( async (req, res ,next)=>{
    const { id, reviewId } = req.params;
    await CampgroundModel.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;