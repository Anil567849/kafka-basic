// const db = require("./database");
async function bulkInsert(messages) {
    try {
    //   await db.insertMany(messages);
      console.log(`Inserted ${messages.length} messages into the database`);
    } catch (error) {
      console.error("Error inserting messages:", error);
    }
}

module.exports = {bulkInsert};