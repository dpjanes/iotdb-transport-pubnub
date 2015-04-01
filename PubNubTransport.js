/*
 *  PubNubTransport.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-04-01
 *  "April Fool's Day"
 *
 *  Copyright [2013-2015] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

var iotdb = require('iotdb');
var _ = iotdb._;
var bunyan = iotdb.bunyan;

var path = require('path');
var pubnub = require('pubnub');

var util = require('util');
var url = require('url');

var logger = bunyan.createLogger({
    name: 'iotdb-transport-proto',
    module: 'PubNubTransport',
});

/**
 *  Create a transport for PubNub.
 */
var PubNubTransport = function (initd) {
    var self = this;

    self.initd = _.defaults(
        initd,
        iotdb.keystore().get("/transports/PubNubTransport/initd"),
        {
            prefix: ""
        }
    );
    
    self.native = pubnub({
        ssl: true,  
        publish_key: self.initd.publish_key,
        subscribe_key: self.initd.subscribe_key,
    });
};

/**
 *  List all the IDs associated with this Transport.
 *
 *  The callback is called with a list of IDs
 *  and then null when there are no further values.
 *
 *  Note that this may not be memory efficient due
 *  to the way "value" works. This could be revisited
 *  in the future.
 */
PubNubTransport.prototype.list = function(paramd, callback) {
    var self = this;

    if (arguments.length === 1) {
        paramd = {};
        callback = arguments[0];
    }

    // callback([ id ])
    // callback(null);
};

/**
 */
PubNubTransport.prototype.get = function(id, band, callback) {
    var self = this;

    if (!id) {
        throw new Error("id is required");
    }
    if (!band) {
        throw new Error("band is required");
    }

    var channel = self._channel(id, band);

    // callback(id, band, null); does not exist
    // OR
    // callback(id, band, undefined); don't know
    // OR
    // callback(id, band, d); data
};

/**
 */
PubNubTransport.prototype.update = function(id, band, value) {
    var self = this;

    if (!id) {
        throw new Error("id is required");
    }
    if (!band) {
        throw new Error("band is required");
    }

    var channel = self._channel(id, band);
    var d = _pack(value);

    self.native.publish({ 
        channel: channel,
        message: d,
        callback: function(e) {
            console.log( "SUCCESS!", e, d );
        },
        error: function(e) {
            console.log( "FAILED! RETRY PUBLISH!", e );
        }
    });
};

/**
 */
PubNubTransport.prototype.updated = function(id, band, callback) {
    var self = this;

    if (!id) {
        throw new Error("id is required");
    }
    if (!band) {
        throw new Error("band is required");
    }

    var channel = self._channel(id, band);

    self.native.subscribe({
        channel: channel,
        callback: function(messaged) {
            callback(id, band, _unpack(messaged));
        }
    });
};

/**
 */
PubNubTransport.prototype.remove = function(id, band) {
    var self = this;

    if (!id) {
        throw new Error("id is required");
    }
    if (!band) {
        throw new Error("band is required");
    }

    var channel = self._channel(id, band);
};

/* -- internals -- */
PubNubTransport.prototype._channel = function(id, band, paramd) {
    var self = this;

    paramd = _.defaults(paramd, {
        mkdirs: false,
    });

    var channel = self.initd.prefix;
    if (id) {
        channel = path.join(channel, _encode(id));

        if (band) {
            channel = path.join(channel, _encode(band));
        }
    }

    return channel;
};

var _encode = function(s) {
    return s.replace(/[\/$%#.\]\[]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
};

var _decode = function(s) {
    return decodeURIComponent(s);
}

var _unpack = function(d) {
    return _.d.transform(d, {
        pre: _.ld_compact,
    });
};

var _pack = function(d) {
    return _.d.transform(d, {
        pre: _.ld_compact,
    });
};

/**
 *  API
 */
exports.PubNubTransport = PubNubTransport;
