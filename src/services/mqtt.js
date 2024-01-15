const mqtt = require('mqtt');
const { activityLog } = require("../utils/activityLog");

async function callBroker(user, message, topic, brokerUrl, action) {
    const client = mqtt.connect(brokerUrl);
    // encrypt
    if (action === "push") {
        client.on('connect', () => {
            console.log('Connected');
            client.publish(topic, JSON.stringify(message), (err) => {
                if (err) {
                    console.error('Error publishing message:', err);
                } else {
                    console.log('Message published successfully');
                }
                client.end();
            });
        });
        await activityLog(user, "sync_database", "sync", message.toString(), "123.123");
    }

    if (action === "pull") {
        console.log('Connected to Mosquitto broker');
        client.on('connect', () => {
            client.subscribe("edgeDevices", (err) => {
                if (!err) {
                    console.log(`Subscribed to ${topic}`);
                } else {
                    console.error('Error subscribing to topic:', err);
                }
            });
            client.publish(topic, JSON.stringify(message), (err) => {
                if (err) {
                    console.error('Error publishing message:', err);
                } else {
                    console.log('Message published successfully');
                }
            });
        });
        client.on('message', async (receivedTopic, message) => {
            console.log(`Received message on topic ${receivedTopic}: ${message.toString()}`);
            await activityLog(user, "sync_edge_device", "sync", message, "123.123");
        });
    }
}

module.exports = {
    callBroker,
}