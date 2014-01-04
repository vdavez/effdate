// Populate a JSON file with the days that Congress is on recess...

exports.recessBuilder = function () {
	var _ = require('underscore');
var moment = require('moment');
var fs = require('fs');
var holidays = require('./public/moment-holidays.js') 

//Get the JSON file of the Session Days
var house = JSON.parse(fs.readFileSync('./public/house.json','utf-8')).house;
var senate = JSON.parse(fs.readFileSync('./public/senate.json','utf-8')).senate;

//Sort the Session Days File
var ss = _.union(house, senate).sort();
var out = [];

//Populate/Write the Recess Days JSON object
out = getRecessDays(ss);
fs.writeFileSync('./public/recess_days.json',JSON.stringify(out),'utf-8');
console.log('Recess built');


//console.log(moment("2013-12-25").holiday() + ' is a holiday');

/*getRecessDays(array of dates)

This function calculates whether Congress has been a recess of more than 3 days (excluding intervening weekends and holidays) and returns a JSON object of recess periods...
*/

function getRecessDays(ss) {
var b, e, gap;
var out = [];	//The output JSON array
var j = 0;		//This is used to populate the JSON array

//Iterate over each period in the array of session days
for (var i=0; i < (ss.length - 1); i++) {		//Make sure to stop at the second-to-last position 
	b = moment(ss[i]);	//beginning
	e = moment(ss[i+1]);	//end date

	ms2d = 24*60*60*1000;	//this is a conversion from milliseconds to days
	
	gap = Math.round(Math.abs(e-b)/(ms2d))
	//console.log(b + ":" + e + ":" + gap);
	if(gap > 4) {		//find out if the difference in the gap > 4 days
	
		// need to check to see if the gaps are caused by an intervening weekend or holiday.
		if (gap <= 6) {
			var gapday = new moment(b).add('day',1);
			var gk = 0;
			for (var k=0; k <= 6; k++) {
				if (gapday.weekday() == 0 || gapday.weekday() == 6 || typeof(gapday.holiday()) != "undefined" ) {				gk++; if ((gap-gk) <= 4) {break}};
				var gapday = new moment(gapday).add('day',1);
			continue;}
		}

		// if it is a true 4-day gap, add a day on the front end and subtract a day on the back end, and populate the JSON array 
		else {
			out[j] = {"begin":new moment(b).add('day',1).format("YYYY/MM/DD"),"end":moment(e).subtract('day',1).format("YYYY/MM/DD")}; j++;
	}};
}
return out;
}
}