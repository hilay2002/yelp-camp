const { campgroundSchema, reviewSchema } = require('./schemasJoi');
const CampgroundModel = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utilities/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be login');
        return res.redirect('/login');
    }
    next();
};
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body , { abortEarly: false });
    if(error) {
        const msg = error.details.map( o => o.message).join(',');
        throw new ExpressError( msg, 400);
    }else{
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    campground = await CampgroundModel.findById(req.params.id);
    if(!campground.author.equals(req.user.id)){
        req.flash('error', 'you are not the auther of this camp');
        return res.redirect(`/campgrounds/${campground._id}`);
    } next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    if(!review.author.equals(req.user.id)){
        req.flash('error', 'you are not the auther of this review');
        return res.redirect(`/campgrounds/${req.params.id}`);
    } next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body , { abortEarly: false });
    if(error) {
        const msg = error.details.map( o => o.message).join(',');
        throw new ExpressError( msg, 400);
    }else{
        next();
    }
}