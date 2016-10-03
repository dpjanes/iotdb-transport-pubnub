/*
 *  sender.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-10-03
 *
 *  PubNub transporter for _sending_ data
 *
 *  Copyright [2013-2016] [David P. Janes]
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

const iotdb = require('iotdb');
const _ = iotdb._;

const iotdb_transport = require('iotdb-transport');
const errors = require('iotdb-errors');

const assert = require("assert");
const pubnub = require("pubnub");

const logger = iotdb.logger({
    name: 'iotdb-transport-pubnub',
    module: 'sender',
});

const make = (initd) => {
    const self = iotdb_transport.make();
    self.name = "iotdb-transport-pubnub/sender";

    const _initd = _.d.compose.shallow(initd, {
        bands: [ "istate" ],
        publishKey: null,
        subscribeKey: null,
    });

    assert.ok(_initd.publishKey, "initd.publishKey is required");

    const _client = new pubnub(_initd);
    const _encode = s => s;

    self.rx.list = (observer, d) => {
        observer.onCompleted();
    };

    self.rx.added = (observer, d) => {
        observer.onCompleted();
    };

    self.rx.put = (observer, d) => {
        if (_initd.bands && (_initd.bands.indexOf(d.band) === -1)) {
            return observer.onCompleted();
        }

        const packet = {
            channel: `iot.${ _encode(d.id) }.${ _encode(d.band) }`,
            message: d.value,
        }

        console.log("+", "publishing")
        _client.publish(packet, function(status, response) {
            console.log(status);
            if (status.error) {
                return observer.onError(new Error("unknown error"));
            }

            observer.onNext(d);
            observer.onCompleted();
        })
    };
    
    self.rx.get = (observer, d) => {
        observer.onCompleted();
    };
    
    self.rx.bands = (observer, d) => {
        observer.onCompleted();
    };

    self.rx.updated = (observer, d) => {
        observer.onCompleted();
    };

    return self;
};

/**
 *  API
 */
exports.make = make;
