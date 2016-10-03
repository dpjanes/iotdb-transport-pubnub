/*
 *  put.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-10-02
 */

const transporter = require("../transporter");
const _ = require("iotdb")._;

const testers = require("iotdb-transport").testers;

const transport = transporter.make();
testers.put(transport);
