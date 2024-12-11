const calculateSplit = (basePrice) => {
    const taxRate = 0.18; 
    const platformFeeRate = 0.1;

    const taxAmount = basePrice * taxRate;
    const totalAmount = basePrice + taxAmount;
    const platformFee = basePrice * platformFeeRate;
    const teacherShare = basePrice - platformFee;

    return { taxAmount, totalAmount, platformFee, teacherShare };
};

module.exports = calculateSplit;  