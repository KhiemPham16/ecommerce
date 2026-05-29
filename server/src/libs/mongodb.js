require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        const conn = await mongoose.connect(process.env.DATABASE_URL);

        console.log(`Connected to MongoDB: ${conn.connection.name}`);
    } catch (err) {
        console.error('DB connection error:', err.message);
        throw err;
    }
};

module.exports = { connectDB };
