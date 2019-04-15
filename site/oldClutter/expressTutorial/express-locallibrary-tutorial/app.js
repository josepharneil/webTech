var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Add mid dleware libraries
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//Serve all static files in /public
app.use(express.static(path.join(__dirname, 'public')));

//Route-handling code
//Defines particular routes for the different parts of the site
app.use('/', indexRouter);
app.use('/users', usersRouter);

//Final middleware adds handler methods for errors and HTTP 404 responses
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Now we have fully configured the Express application object, app
//We finally add it to the module exports
//This is what allows it to be imported by /bin/www
module.exports = app;
