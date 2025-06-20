const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true
  },
  genericName: {
    type: String,
    required: [true, 'Generic name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  availableForms: [{
    form: {
      type: String,
      required: true,
      trim: true
    },
    strengths: [{
      type: String,
      trim: true
    }]
  }],
  sideEffects: [{
    type: String,
    trim: true
  }],
  contraindications: [{
    type: String,
    trim: true
  }],
  interactions: [{
    type: String,
    trim: true
  }],
  storageInstructions: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    trim: true
  },
  barcode: {
    type: String,
    trim: true
  },
  isPrescriptionRequired: {
    type: Boolean,
    default: true
  },
  availableStock: {
    type: Number,
    default: 0
  },
  usageInstructions: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  }
}, {
  timestamps: true,
  collection: 'Medicines'
});

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;
