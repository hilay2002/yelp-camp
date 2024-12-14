const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviewC = require('../controlers/reviews');


router.post('/campgrounds/:id/review',isLoggedIn, validateReview, catchAsync(reviewC.createReview))

router.delete('/campgrounds/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewC.deleteReview))

module.exports = router;