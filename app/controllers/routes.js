var express = require('express')
  , router = express.Router()
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Story = mongoose.model('Story')
  , Board = mongoose.model('Board')
  , Item = mongoose.model('Item')
  , passport = require('passport')
  , bcrypt = require('bcryptjs');

module.exports = function (app) {
  app.use('/', router);
};

/*********************************************
* Landing
*********************************************/
router.get('/', (req, res) => {
  if (!req.user) return res.redirect('/login');
  return res.redirect('/profile');
});

/*********************************************
* Register
*********************************************/
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register',
    isLoggedIn: req.user
  });
});

router.post('/register', (req, res) => {

  // Check if passwords match
  if (req.body.password !== req.body.password2) {
    return res.redirect('/register');
  }

  // Check if username is taken
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) return done(err);
    if (user) return done(err);

    // Encrypt password
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {

          // Create user
          User.create({
            username: req.body.username,
            password: hash
          }, (err) => {
            if (err) return done(err);
            res.redirect('/login');
          });
        });
    });
  });
});

/*********************************************
* Login
*********************************************/
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    isLoggedIn: req.user
  });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  })
);

/*********************************************
* Logout
*********************************************/
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

/*********************************************
* Profile
* @restricted
*********************************************/
router.get('/profile', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('profile', {
    title: 'Profile',
    isLoggedIn: true
  });
});

/*********************************************
* Dashboard
* @restricted
*********************************************/
router.get('/dashboard', (req, res) => {
  if (!req.user) return res.redirect('/login');
  res.render('dashboard', {
    title: 'Dashboard',
    isLoggedIn: true
  });
});
