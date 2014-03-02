var http = require('http');
var _ = require('underscore');
var fs = require('fs');
var moment = require('moment');
var knox = require('knox');

checkToday();

function checkToday () {
	var t = moment().format("YYYY-MM-DD");
	chambers = ['house', 'senate'];
	_.each(chambers, function (chamber) {
		checkGPO(t, chamber)
	});
}

function addDay(day, chamber) {
	var path = './public/' + chamber + '.json';
	var f = JSON.parse(fs.readFileSync(path, 'utf-8'));
	f[chamber].push(day);
	fs.writeFileSync(path, JSON.stringify(f), 'utf-8');
//	printdays(path);
}

function printdays(path) {
    var client = knox.createClient({
    key: process.env.AWSAccessKeyId
  , secret: process.env.AWSSecretKey
  , bucket: 'effdate'
});
    client.putFile(path, path , { 'x-amz-acl': 'public-read' }, function (err, result) {
    if (err != null) {
             return console.log(err);
         } else {
             return console.log("File: " + path + " successfully uploaded to amazon S3");
         }
     });
}

function checkGPO (day, house) {
  var url = 'http://www.gpo.gov/fdsys/pkg/CREC-' + day + '/pdf/CREC-' + day + '-' + house + '.pdf';
    http.get(url, function (res) {
      if (res.statusCode == '200') {
      	addDay(day, house);
        return true;
      }
      else {
        return false;
      }
  }).on('error', function(e) {
  		console.log("Got error: " + e.message);
  	});
}