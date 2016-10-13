var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , bcrypt = require('bcryptjs');

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({
      username: username
    }, (err, user) => {
      console.log('LocalStrategy');
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password,
        (err, isMatch) => {
        	if (err) return done(err);
          if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
          return done(null, user);
        }
      );
    });
  }
));

passport.serializeUser((user, done) => {
  console.log('serializeUser');
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser');
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
