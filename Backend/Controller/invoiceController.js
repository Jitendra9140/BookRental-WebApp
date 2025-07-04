const Invoice = require("../Schema/invoice.js");
const User = require("../Schema/user.js");

// Generate a unique invoice number
const generateInvoiceNumber = () => {
    const prefix = "INV";
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3-digit random number
    return `${prefix}-${timestamp}-${random}`;
};

// Create a new purchase invoice
const createPurchaseInvoice = async (req, res) => {
    try {
        const { userId, items, paymentId } = req.body;
        
        // Find user to get their details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // Calculate total amount
        const totalAmount = items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        
        // Create new invoice
        const invoice = await Invoice.create({
            userId,
            userName: `${user.fname} ${user.lname}`,
            userEmail: user.email,
            userPhone: user.phonenumber,
            invoiceType: 'purchase',
            invoiceNumber: generateInvoiceNumber(),
            items,
            totalAmount,
            paymentId,
            termsAccepted: true,
            status: 'completed',
        });
        
        res.status(201).json({
            success: true,
            message: "Purchase invoice created successfully",
            invoice
        });
    } catch (error) {
        console.error("Error creating purchase invoice:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create purchase invoice",
            error: error.message
        });
    }
};

// Create a new return invoice
const createReturnInvoice = async (req, res) => {
    try {
        const { userId, items } = req.body;
        
        // Find user to get their details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        // Calculate total refund amount (50% of purchase price)
        const totalAmount = items.reduce((total, item) => {
            return total + (Math.floor(item.price * 50 / 100) * item.quantity);
        }, 0);
        
        // Create new invoice
        const invoice = await Invoice.create({
            userId,
            userName: `${user.fname} ${user.lname}`,
            userEmail: user.email,
            userPhone: user.phonenumber,
            invoiceType: 'return',
            invoiceNumber: generateInvoiceNumber(),
            items,
            totalAmount,
            termsAccepted: true,
            status: 'completed',
        });
        
        res.status(201).json({
            success: true,
            message: "Return invoice created successfully",
            invoice
        });
    } catch (error) {
        console.error("Error creating return invoice:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create return invoice",
            error: error.message
        });
    }
};

// Get all invoices for a user
const getUserInvoices = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find all invoices for the user
        const invoices = await Invoice.find({ userId }).sort({ timestamp: -1 });
        
        res.status(200).json({
            success: true,
            invoices
        });
    } catch (error) {
        console.error("Error fetching user invoices:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch invoices",
            error: error.message
        });
    }
};

// Get a specific invoice by ID
const getInvoiceById = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        
        // Find the invoice
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }
        
        res.status(200).json({
            success: true,
            invoice
        });
    } catch (error) {
        console.error("Error fetching invoice:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch invoice",
            error: error.message
        });
    }
};

module.exports = {
    createPurchaseInvoice,
    createReturnInvoice,
    getUserInvoices,
    getInvoiceById
};