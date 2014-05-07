var moment = require('moment');
var http = require('http');
var request = require('request');
var fs = require('fs');

f = JSON.parse(fs.readFileSync('gpo_days.json'));

getGPO(function(result) {
 	fs.writeFileSync("gpo_days.json", JSON.stringify(result)); 
})

function getGPO (callback) {
	["house","senate"].forEach(function (house) {
		day = moment().subtract('days', 1).format("YYYY-MM-DD")
		url = 'http://www.gpo.gov/fdsys/pkg/CREC-' + day + '/pdf/CREC-' + day + '-' + house + '.pdf';
		checkGPO(url, function (exists) {
			if (exists && f[house].indexOf(day) == -1) {
				f[house].push(day);
			}
			callback(f)
		})
	})
}

function checkGPO(url, callback) {
	request.head(url, function (error, response, body) {
		callback (!error && response.statusCode == 200)
 	})
}