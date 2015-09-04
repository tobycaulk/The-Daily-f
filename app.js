var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieparser = require('cookie-parser');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest1');
var session = require('express-session');
var passport = require('./auth');

var routes = require('./routes/index');
var profile = require('./routes/profile');
var login = require('./routes/login');
var register = require('./routes/register');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(session({ secret: 'thisisthesecretkey' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

//DB stuff
app.use(function(req, res, next) {
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/profile', profile);
app.use('/login', login)
app.use('/register', register);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
