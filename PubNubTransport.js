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
var iotdb_transport = require('iotdb-transport');
var _ = iotdb._;

var path = require('path');
var pubnub = require('pubnub');

var util = require('util');
var url = require('url');

var logger = iotdb.logger({
    name: 'iotdb-transport-proto',
    module: 'PubNubTransport',
});

/* --- constructor --- */

/**
 *  See {iotdb_transport.Transport#Transport} for documentation.
 */
var PubNubTransport = function (initd) {
    var self = this;

    self.initd = _.defaults(
        initd,
        {
            channel: iotdb_transport.channel,
            unchannel: iotdb_transport.unchannel,
            encode: _encode,
            decode: _decode,
            pack: _pack,
            unpack: _unpack,
        },
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

PubNubTransport.prototype = new iotdb_transport.Transport;
PubNubTransport.prototype._class = "PubNubTransport";

/* --- methods --- */

/**
 *  See {iotdb_transport.Transport#list} for documentation.
 *  <p>
 *  PubNub does not support list
 */
PubNubTransport.prototype.list = function(paramd, callback) {
    var self = this;

    self._validate_list(paramd, callback);

    callback({
        end: true,
        error: new Error("N/A"),
    });
};

/**
 *  See {iotdb_transport.Transport#added} for documentation.
 */
PubNubTransport.prototype.added = function(paramd, callback) {
    var self = this;

    self._validate_added(paramd, callback);

    var channel = self.initd.channel(self.initd);
};

/**
 *  See {iotdb_transport.Transport#get} for documentation.
 */
PubNubTransport.prototype.get = function(paramd, callback) {
    var self = this;

    self._validate_get(paramd, callback);

    var gd = _.shallowCopy(paramd);
    gd.value = null;

    callback(new errors.NotImplemented(), gd);
};

/**
 *  See {iotdb_transport.Transport#update} for documentation.
 */
PubNubTransport.prototype.put = function(paramd, callback) {
    var self = this;

    self._validate_update(paramd, callback);

    var channel = self.initd.channel(id, band);
    var d = _pack(value);
    var pd = _.shallowCopy(paramd);

    self.native.publish({ 
        channel: channel,
        message: d,
        callback: function(e) {
            callback(null, pd);
        },
        error: function(e) {
            callback(e, pd);
        }
    });
};

/**
 *  See {iotdb_transport.Transport#updated} for documentation.
 */
PubNubTransport.prototype.updated = function(paramd, callback) {
    var self = this;

    self._validate_updated(paramd, callback);

    var channel = self.initd.channel(id, band);

    self.native.subscribe({
        channel: channel,
        callback: function(messaged) {
            callback(id, band, _unpack(messaged));
        }
    });
};

/**
 *  See {iotdb_transport.Transport#remove} for documentation.
 */
PubNubTransport.prototype.remove = function(paramd, callback) {
    var self = this;

    self._validate_remove(paramd, callback);
};

/* -- internals -- */
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
