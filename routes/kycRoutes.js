const express = require("express");
const router = express.Router();
const multer = require("multer");
const Kyc = require("../models/Kyc");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// Submit KYC
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { userId, fullName, documentType, documentNumber } = req.body;

    const exists = await Kyc.findOne({ userId });
    if (exists) {
      return res.status(400).json({ message: "KYC already submitted" });
    }

    const kyc = new Kyc({
      userId,
      fullName,
      documentType,
      documentNumber,
      documentFile: req.file.path,
      status: "PENDING"
    });

    await kyc.save();
    res.json({ message: "KYC submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Get KYC by userId
router.get("/:userId", async (req, res) => {
  try {
    const kyc = await Kyc.findOne({ userId: req.params.userId });
    if (!kyc) return res.status(404).json({ message: "Not found" });
    res.json(kyc);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
