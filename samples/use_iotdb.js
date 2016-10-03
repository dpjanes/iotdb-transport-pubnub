/*
 *  use_iotdb.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-10-02
 *
 *  Demonstrate uploading Earthquakes to Dweet.io 
 *  using this Transporter.
 *
 *  There's sample dashboard 'use_iotdb.dashboard.json'
 *  that you can load into Deet. You'll have to do some
 *  editing to get the names of the data source correct
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

const testers = require("iotdb-transport").testers;

const iotdb = require("iotdb");
iotdb.use("homestar-feed");
iotdb.connect("USGSEarthquake");

// our source - this automatically picks up everything in IOTDB
const iotdb_transport = require("iotdb-transport-iotdb");
const iotdb_transporter = iotdb_transport.make({});

// our destination
const pubnub_transport = require("../transporter")
const pubnub_transporter = pubnub_transport.make(require("./pubnub.json"));

// connect
pubnub_transporter.monitor(iotdb_transporter);
