
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var _ = require('underscore');
var effdate = require('./routes/effdate');
var http = require('http');
var path = require('path');
var fs = require('fs');

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
var files = ['public/house.json','public/senate.json','public/recess_days.json'];
_.each(files, function (f) {
	var file = fs.createWriteStream('./' + f);
	http.get('http://s3-us-west-2.amazonaws.com/effdate/' + f, function(res) {
    	res.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
            file.end();
        });
    });
	console.log('file: ' + f + ' = successfully loaded');
});

// Registering underscore template
app.engine('html', cons.underscore);
app.set('view engine', 'html');

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/effdate', effdate.effdate);
app.get('/api/1/', effdate.api);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});