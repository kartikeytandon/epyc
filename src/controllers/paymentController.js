const Order = require("../models/Order");
const Teacher = require("../models/Teacher");

exports.initiatePayment = async (req, res) => {
    const { courseId, studentId, basePrice } = req.body;
    const { taxAmount, totalAmount } = calculateSplit(basePrice);

    try {
        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100, 
            currency: "INR",
            receipt: `order_${Date.now()}`,
        });

        await Order.create({
            orderId: razorpayOrder.id,
            studentId,
            courseId,
            basePrice,
            taxAmount,
            totalAmount,
            status: "pending",
        });

        res.status(200).json({ orderId: razorpayOrder.id, totalAmount });
    } catch (error) {
        console.error("Error initiating payment:", error);
        res.status(500).send("Payment initiation failed");
    }
};

exports.verifyPayment = async (req, res) => {
    const { orderId, paymentId, signature } = req.body;

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

    if (generatedSignature !== signature) {
        return res.status(400).send("Invalid payment signature");
    }

    const order = await Order.findOne({ orderId });
    const { platformFee, teacherShare } = calculateSplit(order.basePrice);

    try {
        await razorpay.transfers.create({
            account: Teacher.razorpayAccountId,
            amount: teacherShare * 100,
            currency: "INR",
        });

        await Transaction.create({
            transactionId: `txn_${Date.now()}`,
            orderId,
            paymentId,
            amount: order.totalAmount,
            platformFee,
            teacherShare,
            status: "success",
        });

        order.status = "success";
        await order.save();

        res.status(200).send("Payment and transfer successful");
    } catch (error) {
        console.error("Error during transfer:", error);
        res.status(500).send("Payment transfer failed");
    }
};
