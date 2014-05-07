var moment = require('moment');
var http = require('http');
var request = require('request');
var fs = require('fs');

function run() {
	["house","senate"].forEach(function (chamber) {
		f = JSON.parse(fs.readFileSync('./public/' + chamber + '.json'));
		getGPO(chamber, f[chamber], function(result) {
			writeHouse(chamber, result, function () {
				var recess = require('./recess');
//				recess.build()
			})
		})
//		console.log(f[chamber])
	})
}

function getGPO (chamber, daysObj, callback) {
	day = moment().subtract('days', 1).format("YYYY-MM-DD")
	url = 'http://www.gpo.gov/fdsys/pkg/CREC-' + day + '/pdf/CREC-' + day + '-' + chamber + '.pdf';
	checkGPO(url, function (exists) {
		if (exists && daysObj.indexOf(day) == -1) {
			daysObj.push(day);
		}
		callback(daysObj)
	})
}

function checkGPO(url, callback) {
	request.head(url, function (error, response, body) {
		callback (!error && response.statusCode == 200)
 	})
}

function writeHouse(chamber, array, callback) {
	out = {}
	out[chamber] = array
	fs.writeFileSync("./public/" + chamber + ".json", JSON.stringify(out));
	callback()
}

module.exports = run()