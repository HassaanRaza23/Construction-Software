const mongoose = require('mongoose');

const boqItemSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  category: {
    type: String,
    enum: ['civil', 'electrical', 'plumbing', 'finishing', 'steel', 'concrete', 'labor', 'other'],
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  description: String,
  unit: {
    type: String,
    required: true // e.g., 'kg', 'sqft', 'pcs', 'bags'
  },
  quantity: {
    type: Number,
    required: true
  },
  ratePerUnit: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  supplier: {
    name: String,
    contact: String
  },
  orderedQuantity: {
    type: Number,
    default: 0
  },
  receivedQuantity: {
    type: Number,
    default: 0
  },
  usedQuantity: {
    type: Number,
    default: 0
  },
  phase: {
    type: String,
    enum: ['piling', 'raft', 'plinth', 'grey-structure', 'finishing', 'elevation']
  },
  floor: Number,
  status: {
    type: String,
    enum: ['pending', 'ordered', 'partial', 'received', 'in-use', 'completed'],
    default: 'pending'
  },
  orderDate: Date,
  deliveryDate: Date,
  notes: String
}, {
  timestamps: true
});

// Calculate remaining quantity
boqItemSchema.virtual('remainingQuantity').get(function() {
  return this.quantity - this.usedQuantity;
});

// Index for efficient querying
boqItemSchema.index({ project: 1, category: 1, status: 1 });

module.exports = mongoose.model('BOQItem', boqItemSchema);