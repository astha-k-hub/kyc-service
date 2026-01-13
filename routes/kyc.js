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
    const kyc = await Kyc.create({
      userId,
      fullName,
      documentType,
      documentNumber,
      documentFile: req.file.path,
      status: "PENDING",
    });

    return res.json({
      success: true,
      status: "PENDING",
      message: "KYC submitted successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
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

module.exports = router;
