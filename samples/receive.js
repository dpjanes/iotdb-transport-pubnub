/*
 *  receive.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-03-07
 *
 *  Demonstrate receiving
 *  Make sure to see README first
 */

var Transport = require('../PubNubTransport').PubNubTransport;

var p = new Transport({
});
p.updated("MyThingID", "meta", function(error, ud) {
    if (error) {
        console.log("#", error);
        return;
    }

    BROKEN
    if (value === undefined) {
        p.get(id, band, function(_id, _band, value) {
            if (error) {
                console.log("#", error);
                return;
            }
            console.log("+", id, band, value);
        });
    } else {
        console.log("+", id, band, value);
    }
});
