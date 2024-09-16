const { kafka } = require("./client");
const group = process.argv[2]; // node consumer.js group_name | so process.argv[2] is group_name
const {bulkInsert} = require('./utils/db/db.js');


const BATCH_SIZE = 10;
const messageBuffer = [];

async function init() {
  const consumer = kafka.consumer({ groupId: group }); // create a consumer by group id
  await consumer.connect();

  await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      const messageValue = message.value.toString();
      console.log(`${group}: [${topic}]: PART:${partition}:`, messageValue);
      
      // Add the message to the buffer
      messageBuffer.push({
        topic,
        partition,
        offset: message.offset,
        value: messageValue,
        timestamp: message.timestamp
      });

      // If the buffer reaches the batch size, perform bulk insert
      if (messageBuffer.length >= BATCH_SIZE) {
        await bulkInsert(messageBuffer);
        messageBuffer.length = 0; // Clear the buffer
      }

    },
  });
}

// Function to handle process termination and insert remaining messages
async function gracefulShutdown() {
  if (messageBuffer.length > 0) {
    console.log(`Inserting remaining ${messageBuffer.length} messages`);
    await bulkInsert(messageBuffer);
  }
  process.exit(0); // Node.js event loop is stopped immediately. Any non-zero exit code indicates that an error occurred.
}

// This is a method in Node.js allows you to register event listeners on the process object.
process.on('SIGTERM', gracefulShutdown); // (Signal Terminate) eg: kill cmd call
process.on('SIGINT', gracefulShutdown); // (Signal Interrupt) eg: CTRL+C

init().catch(console.error);
