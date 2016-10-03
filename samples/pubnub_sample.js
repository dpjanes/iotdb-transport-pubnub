// see https://www.pubnub.com/docs/nodejs/pubnub-javascript-sdk-v4
//
const iotdb = require("iotdb");
const _ = iotdb._;

const pubnub = require('pubnub')

const client = new pubnub(require("./pubnub.json"));

const publish = () => {
    var publishConfig = {
        channel : "iot.world",
        message : {
            text: "Hello from PubNub Docs!",
            "@timestamp": _.timestamp.make(),
        },
    }

    console.log("+", "publishing")
    client.publish(publishConfig, function(status, response) {
        console.log(status, response);
    })
}

const listen = (status) => {
    client.addListener({
        status: status || _.noop,
        message: function(message) {
            console.log("+", "message", message);
        },
        presence: function(presenceEvent) {
            // handle presence
        }
    })

    console.log("+", "subscribing");
    client.subscribe({
        channels: [ "iot.*" ],
    });
}

listen(event => {
    if (event.category === "PNConnectedCategory") {
        publish();
    }
})
