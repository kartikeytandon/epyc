const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },

  razorpayAccountId: { type: String }, 
  referenceId: { type: String }, 
  legalBusinessName: { type: String },
  businessType: { type: String }, 
  productConfigured: { type: Boolean, default: false },

  address: {
    street1: { type: String, required: true },
    street2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "IN" }, 
  },

  pan: { type: String, required: true },
  gst: { type: String }, 

  bankAccount: {
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    beneficiaryName: { type: String, required: true },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Teacher", TeacherSchema);