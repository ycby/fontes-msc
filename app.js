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
var helpRouter = require('./routes/help');
var bibliographyRouter = require('./routes/bibliographies');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const {
  BASE_URL
} = process.env;
var baseUrl = BASE_URL;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(baseUrl, express.static('public'));
app.use(baseUrl, express.static('node_modules/autocompleter'));

baseRouter.use('/search', searchRouter);
baseRouter.use('/about', aboutRouter);
baseRouter.use('/pinned', pinnedRouter);
baseRouter.use('/help', helpRouter);
baseRouter.use('/bibliography', bibliographyRouter);
app.use(baseUrl, baseRouter);

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
