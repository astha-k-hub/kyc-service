const express = require("express");
const router = express.Router();
const KYC = require("../models/Kyc");
const upload = require("../config/multer");

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { userId, fullName, documentType, documentNumber } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File missing" });
    }

    const kyc = new KYC({
      userId,
      fullName,
      documentType,
      documentNumber,
      documentFile: req.file.path,
      status: "PENDING",
    });

    await kyc.save();

    res.json({ message: "KYC submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:userId", async (req, res) => {
  const kyc = await KYC.findOne({ userId: req.params.userId });
  if (!kyc) return res.status(404).json({ message: "Not found" });
  res.json(kyc);
});

module.exports = router;
