const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const CampgroundModel = require('../models/campground');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');
const campgroundC = require('../controlers/campgrounds');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campgroundC.index))
    .post(isLoggedIn, upload.array('images'), validateCampground, catchAsync(campgroundC.createNewCampground));
router.get('/new', isLoggedIn, campgroundC.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgroundC.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('images'), validateCampground, catchAsync(campgroundC.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundC.deleteCampground));

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgroundC.renderEditForm));
 
module.exports = router;