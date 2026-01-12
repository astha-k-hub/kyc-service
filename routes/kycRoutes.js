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
router.post("/kyc", upload.single("file"), async (req, res) => {
  try {
    const { userId, fullName, documentType, documentNumber } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No document uploaded" });
    }

    let status = "APPROVED";

    // 1️⃣ Full name check
    if (!fullName || fullName.length < 3) status = "REJECTED";

    // 2️⃣ Document number validation
    if (documentType === "AADHAR" && !/^\d{12}$/.test(documentNumber)) status = "REJECTED";
    if (documentType === "PAN" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(documentNumber)) status = "REJECTED";

    // 3️⃣ File type check
    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowed.includes(req.file.mimetype)) status = "REJECTED";

    // 4️⃣ File size check (10KB min)
    if (req.file.size < 10000) status = "REJECTED";

    // 5️⃣ Prevent duplicate document numbers
    const exists = await Kyc.findOne({ documentNumber });
    if (exists) status = "REJECTED";

    const kyc = await Kyc.create({
      userId,
      fullName,
      documentType,
      documentNumber,
      documentFile: req.file.path,
      status
    });

    res.json({ message: "KYC processed", status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
