import express from "express";
import multer from "multer";
import Kyc from "../models/Kyc.js";

const router = express.Router();

// Storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/kyc");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

function autoVerify({ documentType, documentNumber, documentFile }) {

  // Aadhaar: 12 digits
  if (documentType === "AADHAR") {
    if (!/^\d{12}$/.test(documentNumber)) return "REJECTED";
  }

  // PAN: 5 letters + 4 digits + 1 letter
  if (documentType === "PAN") {
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(documentNumber)) return "REJECTED";
  }

  // Image must exist
  if (!documentFile) return "REJECTED";

  return "APPROVED";
}
// ===============================
// Submit KYC
// ===============================
router.post("/", upload.single("document"), async (req, res) => {
  try {
    const { userId, fullName, documentType, documentNumber } = req.body;

    if (!userId || !fullName || !documentType || !documentNumber || !req.file) {
      return res.status(400).json({ error: "All fields required" });
    }

    // Check if KYC already exists
    let existing = await Kyc.findOne({ userId });

    if (existing) {
      return res.json({
        status: existing.status,
        message: "KYC already submitted",
      });
    }

    // Create new KYC
   const status = autoVerify({
  documentType,
  documentNumber,
  documentFile
});

const kyc = await KYC.create({
  userId,
  fullName,
  documentType,
  documentNumber,
  documentFile,
  status
});
    
  return res.json({
  success: true,
  status: kyc.status,
  message:
    kyc.status === "APPROVED"
      ? "KYC verified and approved"
      : "KYC submitted and under verification",
});


// ===============================
// Get KYC status by userId
// ===============================
router.get("/:userId", async (req, res) => {
  try {
    const kyc = await Kyc.findOne({ userId: req.params.userId });

    if (!kyc) {
      return res.json({ status: "NOT_SUBMITTED" });
    }

    return res.json({
      status: kyc.status,
      fullName: kyc.fullName,
      documentType: kyc.documentType,
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
