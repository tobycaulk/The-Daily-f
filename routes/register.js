var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt-nodejs');

router.get('/', function(req, res) {
	res.render('register');
});

router.post('/register', function(req, res) {
	var db = req.db;
	var collection = db.get('users');

	var email = req.body.email;
	var username = req.body.username;
	var profilePicture = req.body.profilePicture;
	var unhashedPass = req.body.password;

	var hashedPass = bcrypt.hashSync(unhashedPass);

	var doc = { email : email, username : username, password : hashedPass, points : '0', profilePicture: profilePicture };

	collection.insert(doc, function(err, records) {
		res.redirect('/login');
	});
});

module.exports = router;