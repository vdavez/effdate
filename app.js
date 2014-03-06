
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var _ = require('underscore');
var effdate = require('./routes/effdate');
var http = require('http');
var path = require('path');
var fs = require('fs');
var knox = require('knox');
var cronJob = require('cron').CronJob;

var app = express();
var cons = require('consolidate');

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// OnFirstLoad, you get the latest from Amazon
var sessionBuilder = require('./sessionBuilder');
setTimeout(function () {
	var recessBuilder = require('./recessBuilder');
}, 30000);


new cronJob('00 00 * * * *', function () {
  sessionBuilder;
}, null, true, "America/Los_Angeles");

new cronJob('00 10 * * * *', function () {
  recessBuilder;  
}, null, true, "America/Los_Angeles");

// Registering underscore template
app.engine('html', cons.underscore);
app.set('view engine', 'html');

app.get('/', routes.index);
app.get('/effdate', effdate.effdate);
app.get('/api/1/', effdate.api);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});