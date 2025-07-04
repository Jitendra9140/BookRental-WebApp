const mongoose = require("mongoose");
require('dotenv').config();

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDatabase = async () => {
    try {
        // Get MongoDB URI from environment variables or use default
        const mongoURI = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/AtRent';
        
        // Connection options
        const options = {
            autoIndex: true,
        };
        
        // Connect to MongoDB
        const connection = await mongoose.connect(mongoURI, options);
        
        console.log(`MongoDB connected: ${connection.connection.host}`);
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });
        
        // Handle process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });
        
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDatabase;