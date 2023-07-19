var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(use LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, function(email, password, done) {
  User.findOne({email:email}).then(function(user){
    if (!user || !user.validPassword(password)) {
      return done(null, false, {errors: {'email or password':'is invalid'}});
    }

    return done(null, user);
  }).catch(done);
});
