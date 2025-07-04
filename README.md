# Book Rental Web Application

## Overview
This is a full-stack web application for renting books online. Users can browse available books, rent them, and return them when they're done. The application includes user authentication, profile management, book management, and payment integration.

## Project Structure
- **Frontend**: React.js application in the `bookrentalapp` directory
- **Backend**: Node.js/Express.js API in the `Backend` directory

## Features
- User registration and authentication
- User profile management
- Book browsing and searching
- Book rental and return system
- Payment integration with Razorpay
- Image upload with Cloudinary
- Invoice generation

## Technologies Used

### Frontend
- React.js
- Material-UI
- Axios for API requests
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Razorpay for payments
- Cloudinary for image storage

## Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Razorpay account
- Cloudinary account

### Backend Setup
1. Navigate to the Backend directory:
   ```
   cd Backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` with your configuration:
   ```
   # MongoDB Connection
   MONGO_URI=mongodb://0.0.0.0:27017/AtRent

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key

   # Razorpay Credentials
   KEY_ID=your_razorpay_key_id
   KEY_SECRET=your_razorpay_key_secret

   # Cloudinary Credentials
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email Configuration for Password Reset
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   EMAIL_SERVICE=gmail
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd bookrentalapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Deployment

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

## Environment Variables Protection

To ensure your environment variables are not accidentally committed to GitHub:

1. **Backend**: The `.env` file is already included in the `.gitignore` file.

2. **Frontend**: Make sure the following files are in your `.gitignore`:
   - `.env.local`
   - `.env.development.local`
   - `.env.test.local`
   - `.env.production.local`
   - `.env.production` (add this if not already included)

3. **If you've already committed sensitive files**:
   - Remove them from git tracking without deleting the file:
     ```
     git rm --cached .env
     git rm --cached .env.production
     ```
   - Then commit this change:
     ```
     git commit -m "Remove sensitive files from git tracking"
     ```

## API Documentation

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user
- `POST /auth/logout` - Logout a user

### Users
- `GET /user/:id` - Get user by ID
- `PUT /user/:id` - Update user profile
- `PUT /user/password/:id` - Update user password

### Books
- `GET /books` - Get all books
- `GET /books/:id` - Get book by ID
- `POST /books` - Add a new book
- `PUT /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book

### Cart
- `GET /cart/:userId` - Get user's cart
- `POST /cart/:userId` - Add book to cart
- `DELETE /cart/:userId/:bookId` - Remove book from cart

### Invoices
- `POST /invoice/purchase` - Create a purchase invoice
- `POST /invoice/return` - Create a return invoice
- `GET /invoice/user/:userId` - Get all invoices for a user
- `GET /invoice/:id` - Get invoice by ID

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.