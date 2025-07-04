const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const cookiparser = require("cookie-parser");
const Connection = require("./db");
const path = require("path");

// Load environment variables
require("dotenv").config();

// Import routes
const Router = require("./Router/router");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8000;

// Connect to database
Connection();
// Middleware setup
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || "*", // In production, set CLIENT_URL to your Netlify URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

// Parse JSON requests
app.use(express.json());

// Cookie parser
app.use(cookiparser());

// Static files
app.use("/public", express.static(path.join(__dirname, 'public')));

// Routes
app.use("/", Router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Health check route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Book Rental API is running",
        version: "1.0.0"
    });
});

// Payment key route
app.get("/pay/getkey", (req, res) => {
    res.status(200).json({ key: process.env.KEY_ID });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend is listening on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
