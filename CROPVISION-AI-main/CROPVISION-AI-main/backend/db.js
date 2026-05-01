require('dotenv').config();
const mongoose = require('mongoose');

// If Astra DB credentials exist, configure the Astra Mongoose driver
if (process.env.ASTRA_DB_API_ENDPOINT && process.env.ASTRA_DB_APPLICATION_TOKEN && process.env.ASTRA_DB_API_ENDPOINT !== "YOUR_API_ENDPOINT") {
    const { driver, createAstraUri } = require('@datastax/astra-mongoose');
    
    // Override Mongoose driver for Astra
    mongoose.setDriver(driver);

    const astraUri = createAstraUri(
        process.env.ASTRA_DB_API_ENDPOINT,
        process.env.ASTRA_DB_APPLICATION_TOKEN
    );

    mongoose.connect(astraUri, { isAstra: true })
        .then(() => console.log('Connected to DataStax Astra DB successfully!'))
        .catch(err => {
            console.error('Astra DB connection error:', err);
        });
} else {
    // Fallback to standard MongoDB
    console.log("Astra DB credentials not found. Falling back to local MongoDB URI.");
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cropdb';
    
    mongoose.connect(mongoUri)
        .then(() => console.log('MongoDB connected'))
        .catch(err => {
            console.error('MongoDB connection error:', err);
            // Continue without DB
        });
}

module.exports = mongoose;
