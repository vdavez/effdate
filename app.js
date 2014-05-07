/**
 * Module dependencies.
 */

var express = require('express');
var _ = require('underscore');
var effdate = require('./routes/effdate');
var http = require('http');
var path = require('path');
var fs = require('fs');
var cronJob = require('cron').CronJob;

var app = express();
var cons = require('consolidate');

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

new cronJob('00 00 * * * *', function () {
	var gpo = require('./gpo')
}, null, true, "America/Los_Angeles");

// Registering underscore template
app.engine('html', cons.underscore);
app.set('view engine', 'html');

app.get('/', function(req, res) {
	res.render('index', {});
});
app.get('/effdate', effdate.effdate);
app.get('/api/1/', effdate.api);
app.get('/recess', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.sendfile('./public/recess_days.json');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});