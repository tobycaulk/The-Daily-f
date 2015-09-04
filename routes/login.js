var express = require('express');
var router = express.Router();

var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy;

router.get('/', function(req, res) {
	res.render('login');
});

router.post('/login', passport.authenticate('local', {
	failureRedirect: '/login',
	successRedirect: '/'
}));

module.exports = router;