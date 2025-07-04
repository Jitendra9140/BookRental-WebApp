const jwt = require("jsonwebtoken")
const User = require("../Schema/user");
const { isValidObjectId } = require('../utils/validation');
require('dotenv').config();

// Use environment variable for JWT secret
const secretKey = process.env.JWT_SECRET || "jnnnfnfnfndsnfsifnfjsbs";
/**
 * Authentication middleware to verify JWT token and attach user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from authorization header
        const token = req.headers.authorization;
        
        // Check if token exists
        if (!token) {
            return res.status(401).json({
                status: 401,
                message: "Authentication failed: No token provided"
            });
        }
        
        // Verify token
        const verifyToken = jwt.verify(token, secretKey);
        
        // Validate user ID from token using our utility function
        if (!isValidObjectId(verifyToken.id)) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Invalid user ID in token"
            });
        }
        
        // Find user by ID from token
        const rootuser = await User.findById(verifyToken.id);
        
        // Check if user exists
        if (!rootuser) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            });
        }
        
        // Attach user and token info to request object
        req.rootuser = rootuser;
        req.token = token;
        req.id = verifyToken.id;
        
        // Proceed to next middleware
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        
        // Handle different types of JWT errors
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                status: 401,
                message: "Invalid token"
            });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                status: 401,
                message: "Token expired"
            });
        }
        
        // Generic error response
        res.status(401).json({
            status: 401,
            message: "Authentication failed: " + error.message
        });
    }
}
/**
 * Middleware to store temporary data in request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const storeData = (req, res, next) => {
    try {
        // Validate required fields
        if (!req.body.amount) {
            return res.status(400).json({
                status: 400,
                message: "Amount is required"
            });
        }
        
        if (!req.user || !req.user.id || !req.user.fname) {
            return res.status(400).json({
                status: 400,
                message: "User information is missing"
            });
        }
        
        // Store data in request object
        req.tempData = {
            amount: req.body.amount,
            userId: req.user.id,
            userName: req.user.fname,
            timestamp: new Date().toISOString()
        };
        
        next();
    } catch (error) {
        console.error("Error in storeData middleware:", error);
        res.status(500).json({
            status: 500,
            message: "Server error"
        });
    }
  };
module.exports={
    authenticate,
    storeData,
};