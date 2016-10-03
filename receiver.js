/*
 *  transporter.js
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

const Rx = require('rx');

const logger = iotdb.logger({
    name: 'iotdb-transport-pubnub',
    module: 'receiver',
});

const make = (initd) => {
    const self = iotdb_transport.make();
    self.name = "iotdb-transport-pubnub/receiver";

    const _initd = _.d.compose.shallow(initd, {
        bands: [ "istate" ],
        publishKey: null,
        subscribeKey: null,
    });

    assert.ok(_initd.subscribeKey, "initd.subscribeKey is required");

    const _client = new pubnub(_initd);
    const _encode = s => s;
    const _subject = new Rx.Subject();

    self.rx.list = (observer, d) => {
        observer.onCompleted();
    };

    self.rx.added = (observer, d) => {
        _subject
            .filter(ud => ud.__added)
            .map(ud => {
                const ad = _.d.compose.shallow(d, ud);
                delete ad.__added
                return ad;
            })
            .subscribe(
                d => observer.onNext(d),
                error => observer.onError(error),
                () => observer.onCompleted()
            );
    };

    self.rx.put = (observer, d) => {
        observer.onCompleted();
    };
    
    self.rx.get = (observer, d) => {
        observer.onCompleted();
    };
    
    self.rx.bands = (observer, d) => {
        observer.onCompleted();
    };

    self.rx.updated = (observer, d) => {
        _subject
            .filter(ud => !ud.__added)
            .filter(ud => !d.id || d.id === ud.id)
            .filter(ud => !d.band || d.id === ud.band)
            .map(ud => _.d.compose.shallow(d, ud))
            .subscribe(
                d => observer.onNext(d),
                error => observer.onError(error),
                () => observer.onCompleted()
            );
    };

    const _listen = () => {
        _client.addListener({
            message: message => {
                const parts = message.channel.split(".");
                if (parts.length != 3) {
                    return;
                }
                if (!message.message) {
                    return;
                }

                const d = {
                    id: parts[1],
                    band: parts[2],
                    value: message.message
                };

                console.log("+", "message", d);
                _subject.onNext(d);
            },
        })

        console.log("+", "subscribing");
        _client.subscribe({
            channels: [ "iot.*" ],
        });
    }

    _listen();

    return self;
};

/**
 *  API
 */
exports.make = make;
