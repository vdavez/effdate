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
//var prompt = require('prompt');

function effdate(req, res) {
    var out = [];
    var dayscount = req.query.c;
    if (dayscount == undefined) dayscount = 30;
    var t = req.query.t;
    out = getEffDate(t, dayscount);
    console.log("Effective Date: " + out[1]);
    console.dir("Count: " + out[0]);
    res.send("<h1>Effective Date</h1><p>" + out[1].format("dddd, MMM. DD, YYYY") + "</p><h1>Dates Counted</h1><p>" + out[0] + "</p>");
}

function api(req, res) {
    var out = [];
    var dayscount = req.query.c;
    if (dayscount == undefined) dayscount = 30;
    var t = req.query.t;
    var p = req.query.p;
    out = getEffDate(t, dayscount, p);
    console.log("Effective Date: " + out[1]);
    console.dir("Count: " + out[0]);
    var jsonObj = {
        "transmittal": moment(t).format("YYYY-MM-DD"),
        "effdate": out[1].format("YYYY-MM-DD"),
        "days_array": out[0],
        "effdate_long": out[1].format("dddd, MMM DD, YYYY"),
        "criminal": (dayscount == "60" ? true : false),
        "prediction": (p == "yes" ? true : false)
    };
    return jsonObj;
}

exports.getEffDate = function getEffDate(transmittal, dayscount, prediction) {
    var out = [];
    var i = 0;
    var house = JSON.parse(fs.readFileSync('./public/house.json', 'utf-8')).house;
    var senate = JSON.parse(fs.readFileSync('./public/senate.json', 'utf-8')).senate;
    var sDays = _.union(house, senate);
    var _recess = JSON.parse(fs.readFileSync('./public/recess_days.json', 'utf-8'));

    if (prediction == "yes") {
        _recess.push({
            "begin": "2014/03/17",
            "end": "2014/03/21"
        }, {
            "begin": "2014/04/14",
            "end": "2014/04/25"
        }, {
            "begin": "2014/08/04",
            "end": "2014/09/05"
        })
    }

    var dayOne = moment(transmittal);
    if (!dayOne.isValid()) {
        return out = ['<a href="./">Try again with a Valid Date</a>', 'Invalid Date Entered']
    } else {
        var c = moment(dayOne);
        while (i < dayscount) {
            //Count the day?
            if (isCountedDay(sDays, c, _recess)) {
                out[i] = c.format("YYYY-MM-DD");
                i++;
            }
            c = getNextDay(sDays, c);
        }
    }
    return [out, c];
}

function checkMomentArray(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].isSame(val)) return true;
    }
}

function isCountedDay(arr, val, r) {
    //Check for count
    if (val.weekday() == 0 || val.weekday() == 6 || typeof(val.holiday()) != "undefined" || inRecess(val, r)) {
        return false
    } else {
        return true
    }
}


function getNextDay(arr, val) {
    var duration = moment.duration({
        'days': 1
    });
    var nextDay = moment(val).add(duration);
    return nextDay;
}

function inRecess(val, r) {
    //iterate to check if in range
    if (r != undefined) _recess = r;
    val = val.format("YYYY/MM/DD");
    for (var i = 0; i < _recess.length; i++) {
        var begin = _recess[i].begin;
        var end = _recess[i].end;
        if (val >= begin && val <= end) {
            return true
        };
    }
}
