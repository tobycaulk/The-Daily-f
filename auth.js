var passport = require('passport'), LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var db = require('monk')('localhost:27017/nodetest1');

passport.use(new LocalStrategy({
		passReqToCallback: true
	},
	function(req, username, password, done) {

		var collection = db.get('users');

		collection.findOne({ username: username }, function(err, user) {
			if(err) {
				return done(err);
			}

			if(!user) {
				return done(null, false, { message: 'Incorrect username.' });
			}

			var hashedPass = user.password;

			bcrypt.compare(password, hashedPass, function(err, res) {
				if(res) {				
					req.session.points = user.points;
					req.session.profilePicture = user.profilePicture;		
					return done(null, user);
				} else {
					return done(null, false, { message: 'Incorrect password.' });
				}
			});
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	done(null, { username: username });
});

module.exports = passport;