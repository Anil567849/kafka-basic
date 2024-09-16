const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
  clientId: "my-kafka-app",
  // brokers: ["IP_ADDRESS:9092"], // in windows - [setting -> internet and sharing -> wifi -> change adapter settings -> [click on your connected network] -> details -> copy ipv4 address]
});