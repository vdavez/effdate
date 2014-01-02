
/*
 * GET Effective Date.
 */


/*Known Bugs
[ ]
*/

var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');
var holidays = require('../public/moment-holidays.js')
var prompt = require('prompt');

// Get the list of days in session. This is from a JSON file.
var house = JSON.parse(fs.readFileSync('./public/house.json','utf-8')).house;
var senate = JSON.parse(fs.readFileSync('./public/senate.json','utf-8')).senate;    
var sDays = _.union(house, senate);
var _recess = fs.readFileSync('./public/recess_days.json','utf-8');

exports.effdate = function(req, res){
	var out = [];

	var t = req.query.t.split(/[-\/]/g);
	t[1] = t[1]-1;
	out = getEffDate(t);
	console.log("Effective Date: " + out[1]);
	console.dir("Count: " + out[0]);
	res.send("<h1>Effective Date</h1><p>" + out[1] + "</p><h1>Dates Counted</h1><p>" + out[0] + "</p>");
}

function getEffDate(transmittal) {
var out = [];
var i = 0;
var dayOne = moment(transmittal);
if (!dayOne.isValid()) {(alert("date's invalid"))}
else {
var c = moment(dayOne);
while (i < 30) {
//Count the day?
    if (isCountedDay(sDays,c)) {out[i] = c.format("YYYY/MM/DD"); i++;}
    c = getNextDay(sDays,c);
}
}
return [out, c.format("dddd, MMM. DD, YYYY")];
}

function checkMomentArray (arr, val) {
	for (var i=0; i < arr.length; i++) {
		if (arr[i].isSame(val)) return true;
	}
}

function getNextSessionDay (arr, val) {
	for (var i=0;i < arr.length; i++) {
		if (arr[i].isAfter(val)) return arr[i];
	}
}

function isCountedDay (arr, val) {
    //Check for count
//    if (val.weekday() == 0 || val.weekday() == 6 || typeof(val.holiday()) != "undefined" || (withinThreeDays(arr,val) != true) || inRecess(val) == true) {return false}
    if (val.weekday() == 0 || val.weekday() == 6 || typeof(val.holiday()) != "undefined" || inRecess(val)) {return false}
    else {return true}
}

function withinThreeDays (arr, val) {
	for (var i=0; i < 3; i++)
	{
        var duration = moment.duration({'days' : parseInt(i)});
		var nextDay = moment(val).add(duration);
		if (nextDay.weekday() == 0) {nextDay = moment(nextDay).add('days',1)}
		if (checkMomentArray(arr,nextDay)==true) {return true} 
	}

}

function getNextDay(arr,val) {
	var duration = moment.duration({'days' : 1});
    var nextDay = moment(val).add(duration);
	return nextDay;
}

function inRecess (val) {
	//var _recess = fs.readFileSync('recess_days.json','utf-8');
	//iterate to check if in range
    val = val.format("YYYY-MM-DD")
    for (var i = 0; i < _recess.length; i++) {
        var begin = _recess[i].begin;
        var end = _recess[i].end;
		if (val >= begin && val <= end) return true; 
    }
}