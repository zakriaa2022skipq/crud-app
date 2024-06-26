const mongoose = require("mongoose");

const connectDb = async (URI) => {
  try {
    await mongoose.connect(URI, {
      dbName: "project5",
      maxConnecting: 50,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    const db = mongoose.connection;
    return db;
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong. Try again later");
  }
};

module.exports = connectDb;
