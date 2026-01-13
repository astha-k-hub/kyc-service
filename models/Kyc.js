import mongoose from "mongoose";

const kycSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    fullName: String,
    documentType: String,
    documentNumber: String,
    documentFile: String,
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Kyc", kycSchema);
