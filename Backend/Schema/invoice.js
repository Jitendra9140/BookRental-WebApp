const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    userPhone: {
        type: String,
    },
    invoiceType: {
        type: String,
        enum: ['purchase', 'return'],
        required: true,
    },
    invoiceNumber: {
        type: String,
        required: true,
    },
    items: [
        {
            bookId: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            image: {
                type: String,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentId: {
        type: String,
    },
    termsAccepted: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed',
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("invoice", invoiceSchema);