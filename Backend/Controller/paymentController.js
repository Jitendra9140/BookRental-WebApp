const Payment = require("../Schema/payment.js");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});
let savedData = {
  amt: null,
  userId: null,
  userName: null,
};

const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    savedData.userId = req.body.userId; // Store userId
    savedData.userName = req.body.userName; // Store userName
    savedData.amt = req.body.amount; // Store amount
    const order = await instance.orders.create(options);
    console.log(order);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("Error occurred in checkout");
  }
};

const payvarify = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const userId = savedData.userId; // Access userId
    const userName = savedData.userName; // Access userName
    const amount = savedData.amt;
    // Database logic here
    
    await Payment.create({
      user: userId, // Store the user's ID
      userName: userName, // Store the user's name
      amount: amount, // Store the payment amount
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    
    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

module.exports = {
  payvarify,
  checkout,
};