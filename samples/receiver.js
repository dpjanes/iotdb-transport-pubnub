/*
 *  receiver.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-10-03
 *
 *  Demonstrate receive
 */

const transport = require("../receiver");
const _ = require("iotdb")._;

const testers = require("iotdb-transport").testers;

const receiver_transporter = transport.make(_.d.compose.shallow(require("./pubnub.json"), { bands: null }));

testers.updated(receiver_transporter);
