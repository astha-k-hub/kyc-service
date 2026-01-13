import express from "express";
import multer from "multer";
import Kyc from "../models/Kyc.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });


// Submit KYC
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { userId, fullName, documentType, documentNumber } = req.body;

    let existing = await Kyc.findOne({ userId });
    if (existing) return res.status(400).json({ message: "KYC already submitted" });

    const kyc = await Kyc.create({
      userId,
      fullName,
      documentType,
      documentNumber,
      documentFile: req.file?.path
    });

    res.json({ message: "KYC submitted", status: kyc.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get KYC status
router.get("/:userId", async (req, res) => {
  const kyc = await Kyc.findOne({ userId: req.params.userId });

  if (!kyc) return res.status(404).json({ message: "KYC not submitted" });

  res.json({ status: kyc.status });
});


// Auto verification (called by your app)
router.post("/:userId/auto-verify", async (req, res) => {
  const kyc = await Kyc.findOne({ userId: req.params.userId });
  if (!kyc) return res.status(404).json({ message: "No KYC" });

  // simple rule: PAN or AADHAR > 8 chars = approved
  if (kyc.documentNumber.length >= 8) {
    kyc.status = "APPROVED";
  } else {
    kyc.status = "REJECTED";
  }

  await kyc.save();

  res.json({ status: kyc.status });
});

export default router;
