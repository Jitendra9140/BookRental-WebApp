# Book Rental Web Application

## Deployment Guide

### Frontend Deployment (Netlify)

1. **Prepare your frontend for production:**
   - Make sure all API URLs use the configuration from `src/config.js`
   - Update `.env.production` with your actual backend URL

2. **Deploy to Netlify:**
   - Create a Netlify account if you don't have one
   - Connect your GitHub repository to Netlify
   - Use the following build settings:
     - Base directory: `bookrentalapp`
     - Build command: `npm run build`
     - Publish directory: `bookrentalapp/build`
   - Add the following environment variables in Netlify:
     - `REACT_APP_API_URL`: Your backend URL on Render

3. **Configure Netlify for client-side routing:**
   - The `netlify.toml` file is already set up to handle client-side routing

### Backend Deployment (Render)

1. **Prepare your backend for production:**
   - Make sure all environment variables are properly set up
   - The `.env.example` file shows all required environment variables

2. **Deploy to Render:**
   - Create a Render account if you don't have one
   - Create a new Web Service
   - Connect your GitHub repository
   - Use the following settings:
     - Root Directory: `Backend`
     - Runtime: Node
     - Build Command: `npm install`
     - Start Command: `node index.js`
   - Add all environment variables from `.env.example` with your actual values:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string
     - `KEY_ID` and `KEY_SECRET`: Your Razorpay credentials
     - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Your Cloudinary credentials
     - `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_SERVICE`: Your email service credentials
     - `CLIENT_URL`: Your Netlify frontend URL
     - `NODE_ENV`: Set to `production`

3. **Set up MongoDB Atlas:**
   - Create a MongoDB Atlas account if you don't have one
   - Create a new cluster
   - Create a database user with read/write permissions
   - Whitelist all IP addresses (0.0.0.0/0) for access
   - Get your connection string and update the `MONGO_URI` environment variable

## Post-Deployment

1. Test the entire application flow
2. Verify that all API calls are working correctly
3. Check that image uploads and payments are functioning
4. Ensure user authentication works properly