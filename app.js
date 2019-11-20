var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var nodemailer = require("nodemailer");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(require('connect-history-api-fallback')())

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

app.post('/contact/send', function(req, res) {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'lunamoonfanged@gmail.com',
      pass: 'bfadmin1'
    },
    port: 587,
    secure: false
  });

  var mailOptions = {
    from: req.body.email,
    to: 'lunamoonfanged@gmail.com',
    subject: 'Website Submission',
    text: 'You have a submission with the following details...Name: ' + req.body.name + 'Email: ' + req.body.email + 'Message: ' + req.body.msg,
    html: '<p>You have a submission with the following details...</p><ul><li>' + req.body.name + '</li><li>Email:' + req.body.email + '</li><li> Message:' + req.body.msg + '</li> </ul>'
  }
  transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
      console.log(error);
      res.redirect('/');
    }
    else {
      console.log('Message sent: ' + info.response );
      res.redirect('/');
    }
  });
});

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
