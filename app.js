var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var dev_db_url='mongodb+srv://SanderDeSutter:OW1g8KoMRsB72c61@cluster0.vm6gp.mongodb.net/DansScoolMove?retryWrites=true&w=majority';

var mongoDB = process.env.MONGODB_URI || dev_db_url;
var MongoClient = require('mongodb').MongoClient;
var client = new MongoClient(mongoDB);
try{
    client.connect();
    
}catch(e){
    console.error(e);
}


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var meerInformatieRouter = require('./routes/meerInformatie');
var beheerRouter = require('./routes/beheer');
var schrijfInRouter = require('./routes/inschrijvingsFormulier');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/meerInformatie', meerInformatieRouter);
app.use('/beheer', beheerRouter);
app.use('/inschrijvingsFormulier', schrijfInRouter);

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
