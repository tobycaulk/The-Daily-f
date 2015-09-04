var express = require('express');
var router = express.Router();

var date = require('date');
var db = require('monk')('localhost:27017/nodetest1');

var RecentGuess = function(username, guess) {
	this.username = username;
	this.guess = guess;
};

function populateRecentGuesses(req, res) {
	var recents = [];

	db.get('recentGuesses').find({}, function(err, guess) {
		var i = 0;
		guess.forEach(function(r) {
			recents[i++] = new RecentGuess(r.username, r.guess);
		});

		renderIndex(recents, req, res);
	});
}

function renderIndex(recents, req, res) {
	db.get('baseinfo').findOne({ date : date.getDate() }, function(err, document) {
		if(req.user === undefined) {
			res.render('index', { 
				lowerRange: document.lowerRange, 
				upperRange: document.upperRange, 
				recents : recents
			});
		} else {
			res.render('index', { 
					lowerRange: document.lowerRange, 
					upperRange: document.upperRange, 
					username: req.user.username, 
					points: req.session.points,
					recents : recents
			});
		}
	});
}

/* GET home page. */
router.get('/', function(req, res) {
	populateRecentGuesses(req, res);
});

router.post('/submitGuess', function(req, res) {
	if(req.user === undefined) {
		res.redirect('/login');
	} else {
		db.get('baseinfo').findOne({ date : date.getDate() }, function(err, document) {
			var inputGuess = parseInt(req.body.inputGuess);
			var correct = parseInt(document.correct);

			var recentCollection = db.get('recentGuesses');
			var doc = { username : req.user.username, guess : inputGuess };
			recentCollection.insert(doc, function(err, guess) {
				if(err) {
					console.log('error inserting guess');
				}
			});

			if(inputGuess == correct) {
				db.get('users').findOne({ username : req.user.username }, function(err, user) {
					db.get('users').update({ _id : user._id }, { $set : { "points" : user.points + 1 } }, function(err, result) {
						req.session.points = user.points;
						res.redirect('/correct');	
					});	
				});	
			} else {
				res.redirect('/incorrect');
			}		
		});
	}
});

router.get('/correct', function(req, res) {
	res.render('correct', { 
		username: req.user.username,
		points: req.session.points 
	});
});

router.get('/incorrect', function(req, res) {
	res.render('incorrect', { 
		username: req.user.username,
		points: req.session.points 
	});
});

module.exports = router;
