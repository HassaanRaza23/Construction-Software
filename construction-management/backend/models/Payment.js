const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  type: {
    type: String,
    enum: ['land-purchase', 'transfer-fee', 'legal-fee', 'contractor', 
           'material', 'labor', 'consultant', 'approval-fee', 'other'],
    required: true
  },
  paymentTo: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'cheque', 'bank-transfer', 'online'],
    default: 'bank-transfer'
  },
  referenceNumber: String,
  description: String,
  category: {
    type: String,
    enum: ['capital', 'operational', 'material', 'service']
  },
  relatedPhase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ConstructionPhase'
  },
  relatedBOQItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BOQItem'
  },
  receipt: String, // file path
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'cancelled'],
    default: 'pending'
  },
  notes: String
}, {
  timestamps: true
});

// Index for efficient querying
paymentSchema.index({ project: 1, paymentDate: -1 });
paymentSchema.index({ project: 1, type: 1 });

module.exports = mongoose.model('Payment', paymentSchema);