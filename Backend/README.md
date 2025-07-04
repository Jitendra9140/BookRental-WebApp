# Book Rental Web App - Backend

This is the backend for the Book Rental Web Application. It provides APIs for user authentication, book management, and payment processing.

## Features

- User authentication and authorization using JWT
- Book management (add, view, search)
- Shopping cart functionality
- Payment integration with Razorpay
- Image upload and management with Cloudinary
- Password reset functionality

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Cloudinary for image storage
- Razorpay for payments

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- Razorpay account (for payment processing)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables (see `.env.example` for reference):

```
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret

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

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /add` - Register a new user
- `POST /find` - Login user
- `GET /varifyuser` - Verify authenticated user
- `POST /updatepass` - Update password
- `POST /resetpass` - Request password reset

### Books

- `GET /books` - Get all books
- `GET /:id` - Get book by ID
- `POST /addbook` - Add a new book

### Cart

- `POST /add/cart` - Add item to cart
- `POST /deletebook` - Remove item from cart
- `POST /returnbook` - Find cart item by book ID

### Payment

- `POST /checkout` - Create payment order
- `POST /payvarify` - Verify payment
- `GET /pay/getkey` - Get Razorpay key

## Cloudinary Integration

This application uses Cloudinary for image storage and management. Images are uploaded to Cloudinary and the URLs are stored in the database.

### How it works

1. When a user uploads an image (profile picture or book image), the file is temporarily stored on the server.
2. The file is then uploaded to Cloudinary.
3. After successful upload, the file URL and public ID are stored in the database.
4. The temporary file is deleted from the server.

### Benefits

- Reduced server storage requirements
- Automatic image optimization
- CDN delivery for faster loading
- Image transformations (resize, crop, etc.)
- Secure storage and backup

## Error Handling

The application uses a centralized error handling mechanism. All errors are caught and processed by the error handler middleware, which returns appropriate error responses.

## License

This project is licensed under the MIT License.