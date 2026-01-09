const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    fullName: {
      type: String,
      required: true
    },

    documentType: {
      type: String,
      enum: ['AADHAR', 'PAN', 'PASSPORT'],
      required: true
    },

    documentNumber: {
      type: String,
      required: true
    },

    documentFile: {
      type: String, // file path
      required: true
    },

    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Kyc', kycSchema);
