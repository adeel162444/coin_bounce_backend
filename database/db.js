const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_URL);
    console.log(`database connected to host ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error :${error}`);
  }
};
module.exports = dbConnection;
