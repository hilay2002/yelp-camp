const User = require('../models/user');

module.exports.getRegisterForm = (req, res) => {
    res.render('users/register');
}
module.exports.createUser = async (req, res) => {
    try {
    const { username, email, password } = req.body;
    const user = new User({ email, username});
    const userRegister = await User.register(user, password);
    req.login(userRegister, err => {
        if (err) return next(err);
        req.flash('success', 'you registered successfully :)');
        res.redirect('/campgrounds');
    })} catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}
module.exports.getLoginForm =  (req, res) => {
    res.render('users/login');
}
module.exports.userLogin = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}
module.exports.userLogout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}