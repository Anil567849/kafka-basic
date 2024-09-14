const { kafka } = require("./client");
const group = process.argv[2]; // node consumer.js group_name | so process.argv[2] is group_name

async function init() {
  const consumer = kafka.consumer({ groupId: group }); // create a consumer by group id
  await consumer.connect();

  await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      console.log(
        `${group}: [${topic}]: PART:${partition}:`,
        message.value.toString()
      );
    },
  });
}

init();