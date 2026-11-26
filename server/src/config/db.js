const mongoose = require('mongoose');

let isConnected = false;
let useLocalDb = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vm_eduvera';
  
  try {
    // Attempt Mongoose connection with 2 second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    useLocalDb = false;
    console.log(`[DB] Connected successfully to MongoDB at ${uri}`);
  } catch (error) {
    console.warn(`[DB] MongoDB not detected (${error.message}).`);
    console.log('[DB] Switching seamlessly to built-in JSON Document Engine (server/data/db.json). Zero configuration needed!');
    isConnected = true;
    useLocalDb = true;
  }
};

const getDbMode = () => (useLocalDb ? 'local-json' : 'mongodb');

module.exports = {
  connectDB,
  getDbMode,
  isMongoose: () => !useLocalDb
};
