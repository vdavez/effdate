var _ = require('underscore');
var moment = require('moment');
var holidays = require('./moment-holidays.js')

exports.getEffDate = function getEffDate(transmittal, dayscount, prediction, _recess) {
    var out = [];
    var i = 0;
    if (_recess != null) {
    var dayOne = moment(transmittal);
    if (!dayOne.isValid()) {
        return out = ['<a href="./">Try again with a Valid Date</a>', 'Invalid Date Entered']
    } else {
        var c = moment(dayOne);
        while (i < dayscount) {
            //Count the day?
            if (isCountedDay(c, _recess)) {
                out[i] = c.format("YYYY-MM-DD");
                i++;
            }
            c = getNextDay(c);
        }
    }
    var jsonObj = {
        "transmittal": moment(transmittal).format("YYYY-MM-DD"),
        "effdate": c.format("YYYY-MM-DD"),
        "days_array": out,
        "effdate_long": c.format("dddd, MMM DD, YYYY"),
        "criminal": (dayscount == "60" ? true : false),
        "prediction": (prediction == "yes" ? true : false)
    };
    return jsonObj;
}
else {console.log("error loading recess object")}
    //    };
    //    xhr.send();

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

}

function isCountedDay(val, r) {
    //Check for count
    if (val.weekday() == 0 || val.weekday() == 6 || typeof(val.holiday()) != "undefined" || inRecess(val, r)) {
        return false
    } else {
        return true
    }
}

function getNextDay(val) {
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
