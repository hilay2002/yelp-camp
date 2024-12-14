const express = require('express');
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const userC = require('../controlers/users');


router.route('/register')
    .get(userC.getRegisterForm)
    .post(catchAsync(userC.createUser));

router.route('/login')
    .get(userC.getLoginForm)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login' }), userC.userLogin);

router.get('/logout', userC.userLogout);

module.exports = router;