// This should populate a JSON file of Congress's session days, beginning in the 1990s!!!
// Mad props to @drinks for a great API at capitolwords.org!
// Neat, huh?

exports.sessionBuilder = function () {var http = require('http');
var _ = require('underscore');
var fs = require('fs');

var apikey = "e1b0f4a0c7b94f70aed6e6273c2a5b2c";
var ss = {"house": [], "senate":[]};

_.map(ss, function (days, chamber) {
    var url = "http://capitolwords.org/api/1/dates.json?apikey=" + apikey + "&phrase=a&mincount=0&granularity=day&chamber=" + chamber;

    http.get(url, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
        	var i=0;
            var resp = JSON.parse(body).results;
            _.each(resp, function (d) {if (d.count > 0) {ss[chamber][i] = '"' + d.day + '"'; i++}});
            printdays(chamber, ss[chamber]);
    	}
    );
}).on('error', function(e) {
      console.log("Got error: ", e);
});
});

function printdays(h, ds) {
	var f = './public/' + h + '.json';
	var outString = '{"' + h +'": [' + ds +']}';
	fs.writeFileSync(f, outString, 'utf-8');
};
}