const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  contact: { type: String },

  razorpayAccountId: { type: String }, 
  referenceId: { type: String }, 
  legalBusinessName: { type: String },
  businessType: { type: String }, 
  productConfigured: { type: Boolean, default: false },

  address: {
    street1: { type: String },
    street2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: "IN" }, 
  },

  pan: { type: String },
  gst: { type: String }, 
  accountNumber: { type: String },
  ifscCode: { type: String },
  beneficiaryName: { type: String },
//   bankAccount: {
//     accountNumber: { type: String },
//     ifscCode: { type: String },
//     beneficiaryName: { type: String },
//   },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Teacher", TeacherSchema);