var http = require('http');
var _ = require('underscore');
var moment = require('moment');

console.log("Running tests");
checkGPO("2014-01-09", 'senate');

checkGPO("2014-01-10", 'senate');
checkGPO("2014-01-13", 'senate');

function checkGPO (day, house) {
  var url = 'http://www.gpo.gov/fdsys/pkg/CREC-' + day + '/pdf/CREC-' + day + '-' + house + '.pdf';
    http.get(url, function (res) {
      if (res.statusCode == '200') {
        console.log ('This is a day: ' + url)
        return true;
      }
      else {
      	console.log(['Not a day: ', house, day]);
      	return false;
      }
    })
}