/*
 *  send.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-10-03
 *
 *  Demonstrate sending something
 */

const transport = require("../sender");
const _ = require("iotdb")._;

const testers = require("iotdb-transport").testers;

const sender_transporter = transport.make(_.d.compose.shallow(require("./pubnub.json"), { bands: null }));

testers.put(sender_transporter);
setInterval(() => testers.put(sender_transporter), 2500);
