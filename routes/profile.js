var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	if(req.user === undefined) {
		res.redirect('/login');
	} else {
		res.render('profile', {
			username: req.user.username,
			points: req.session.points,
			profilePicture: req.session.profilePicture
		});
	}
});

router.get('/logout', function(req, res) {
	req.logout();

	res.redirect('/');
});

router.post('/logout', function(req, res) {
	req.logout();

	res.redirect('/');
});

module.exports = router;