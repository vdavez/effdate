// Populate a JSON file with the days that Congress is on recess...

//exports.recessBuilder = function () {
var _ = require('underscore');
var moment = require('moment');
var fs = require('fs');
var holidays = require('./public/moment-holidays.js')

//Get the JSON file of the Session Days
var house = JSON.parse(fs.readFileSync('./public/house.json', 'utf-8')).house;
var senate = JSON.parse(fs.readFileSync('./public/senate.json', 'utf-8')).senate;

//Sort the Session Days File
var ss = _.union(house, senate).sort();
var out = [];

//Populate/Write the Recess Days JSON object
out = getRecessDays(ss);
fs.writeFileSync('./public/recess_days.json', JSON.stringify(out), 'utf-8');
console.log('Recess built');

/*getRecessDays(array of dates)
This function calculates whether Congress has been a recess of more than 3 days (excluding intervening weekends and holidays) and returns a JSON object of recess periods...
*/

function getRecessDays(ss) {
    var b, e, gap;
    var out = []; //The output JSON array
    var j = 0; //This is used to populate the JSON array

    //Iterate over each period in the array of session days
    for (var i = 0; i < (ss.length - 1); i++) { //Make sure to stop at the second-to-last position 
        b = moment(ss[i]); //beginning
        e = moment(ss[i + 1]); //end date
        real = realRecess(b, e);
        if (real != false) {
            out[j] = {
                "begin": new moment(b).add('day', 1).format("YYYY/MM/DD"),
                "end": moment(e).subtract('day', 1).format("YYYY/MM/DD")
            };
            j++;
        }
    }

    //Check if the most recent session day is greater than 4 days away...
    b = moment(ss[ss.length - 1])
    e = moment()
    real = realRecess(b,e);
    if (real != false) {
        out[j] = {
            "begin": new moment(b).add('day', 1).format("YYYY/MM/DD"),
            "end": moment(e).format("YYYY/MM/DD")
        };
        j++;
    }

    return out;
}

function realRecess(b, e) {
    ms2d = 24 * 60 * 60 * 1000; //this is a conversion from milliseconds to days

    gap = Math.round(Math.abs(e - b) / (ms2d))

    if (gap > 3) { //find out if the difference in the gap > 3 days
        // need to check to see if the gaps are caused by an intervening weekend or holiday.
        if (gap <= 6) {
            var gapday = new moment(b).add('day', 1);
            var gk = 0;
            for (var k = 0; k <= 6; k++) {
                if (gapday.weekday() == 0 || gapday.weekday() == 6 || typeof(gapday.holiday()) != "undefined") {
                    gk++;
                    if ((gap - gk) <= 4) {
                        break
                    }
                };
                var gapday = new moment(gapday).add('day', 1);
                continue;

            }
            if (k >= 5 && (gap - gk) >= 4) {
            	//The total oddity in which today is a Sunday or a holiday and the call is whether a long recess took place since last call
                return true
            } 

            return false
        }

        // if it is a true 4-day gap, add a day on the front end and subtract a day on the back end, and populate the JSON array 
        else {
            return true
        }
    };
    return false
}