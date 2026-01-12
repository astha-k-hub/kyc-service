const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const Kyc = require('../models/Kyc');

// POST /kyc → submit KYC
router.post(
  '/kyc',
  upload.single('file'),
  async (req, res) => {
    try {
      const {
        userId,
        fullName,
        documentType,
        documentNumber
      } = req.body;

      if (!req.file) {
        return res.status(400).json({
          message: 'Document file is required'
        });
      }

      const kyc = new Kyc({
        userId,
        fullName,
        documentType,
        documentNumber,
        documentFile: req.file.path
      });

      await kyc.save();

      res.status(201).json({
        message: 'KYC submitted successfully',
        data: kyc
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'KYC submission failed'
      });
    }
  }
);

// GET /kyc/:userId → get KYC status
router.get('/kyc/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const kyc = await Kyc.findOne({ userId })
      .sort({ createdAt: -1 });

    if (!kyc) {
      return res.status(404).json({
        message: 'KYC not submitted'
      });
    }

    res.json({
      userId: kyc.userId,
      fullName: kyc.fullName,
      documentType: kyc.documentType,
      status: kyc.status,
      documentFile: kyc.documentFile,
      submittedAt: kyc.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to fetch KYC status'
    });
  }
});

// PUT /kyc/:id/approve → approve KYC
router.put('/kyc/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;

    const kyc = await Kyc.findByIdAndUpdate(
      id,
      { status: 'APPROVED' },
      { new: true }
    );

    if (!kyc) {
      return res.status(404).json({
        message: 'KYC record not found'
      });
    }

    res.json({
      message: 'KYC approved successfully',
      data: kyc
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to approve KYC'
    });
  }
});


// PUT /kyc/:id/reject → reject KYC
router.put('/kyc/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;

    const kyc = await Kyc.findByIdAndUpdate(
      id,
      { status: 'REJECTED' },
      { new: true }
    );

    if (!kyc) {
      return res.status(404).json({
        message: 'KYC record not found'
      });
    }

    res.json({
      message: 'KYC rejected successfully',
      data: kyc
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to reject KYC'
    });
  }
});


module.exports = router;
