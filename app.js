var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var moment = require("mongoose");
var async = require("async");
var autocompleter = require("autocompleter");

var baseRouter = require("./routes/base")
var searchRouter = require('./routes/search');
var aboutRouter = require('./routes/about');
var pinnedRouter = require('./routes/pinned');
var contactRouter = require('./routes/contact');
var helpRouter = require('./routes/help');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/autocompleter')));

app.use('/', baseRouter);
app.use('/search', searchRouter);
app.use('/about', aboutRouter);
app.use('/pinned', pinnedRouter);
app.use('/contact', contactRouter);
app.use('/help', helpRouter);

console.log("All routes used...");
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

module.exports = app;
