const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  fullName: String,
  documentType: String,
  documentNumber: String,
  documentFile: String,
  status: { type: String, default: "PENDING" }
}, { timestamps: true });

module.exports = mongoose.model("Kyc", kycSchema);
