const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: String,
    city: { type: String, default: 'Karachi' },
    area: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  landDetails: {
    area: Number, // in square yards
    dimensions: {
      length: Number,
      width: Number,
      irregularDimensions: String
    },
    purchaseAmount: Number,
    transferFees: Number,
    legalFees: Number
  },
  feasibility: {
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    calculatedDate: Date,
    estimatedCost: Number,
    estimatedRevenue: Number,
    roi: Number,
    documents: [String]
  },
  landSurvey: {
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    },
    surveyDate: Date,
    surveyorName: String,
    sitePlan: String, // file path
    actualDimensions: {
      length: Number,
      width: Number,
      totalArea: Number,
      details: String
    }
  },
  soilTest: {
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    testDate: Date,
    pilingRequired: Boolean,
    report: String, // file path
    recommendations: String
  },
  approvals: {
    planApproval: {
      status: {
        type: String,
        enum: ['pending', 'submitted', 'approved', 'rejected'],
        default: 'pending'
      },
      submissionDate: Date,
      approvalDate: Date,
      approvalNumber: String,
      documents: [String]
    },
    saleNOC: {
      status: {
        type: String,
        enum: ['pending', 'applied', 'approved', 'rejected'],
        default: 'pending'
      },
      applicationDate: Date,
      approvalDate: Date,
      nocNumber: String,
      documents: [String]
    },
    plinthVerification: {
      status: {
        type: String,
        enum: ['pending', 'scheduled', 'approved', 'rejected'],
        default: 'pending'
      },
      verificationDate: Date,
      approvalDate: Date,
      documents: [String]
    }
  },
  architect: {
    name: String,
    firmName: String,
    contact: String,
    email: String,
    proposedPlan: String, // file path
    materialRequirements: [String] // file paths
  },
  engineers: [{
    type: {
      type: String,
      enum: ['structural', 'electrical', 'plumbing', 'hvac']
    },
    name: String,
    firmName: String,
    contact: String,
    email: String,
    materialRequirements: [String] // file paths
  }],
  boq: {
    createdDate: Date,
    lastUpdated: Date,
    document: String, // file path
    totalEstimate: Number
  },
  contractor: {
    name: String,
    company: String,
    contact: String,
    email: String,
    contractAmount: Number,
    contractDocument: String
  },
  supervisors: [{
    name: String,
    role: String,
    contact: String,
    assignedFloors: [Number]
  }],
  status: {
    type: String,
    enum: ['land-search', 'feasibility', 'land-survey', 'land-purchase', 
           'soil-test', 'planning', 'approval-pending', 'construction', 
           'finishing', 'completed'],
    default: 'land-search'
  },
  startDate: Date,
  estimatedEndDate: Date,
  actualEndDate: Date,
  totalBudget: Number,
  spentAmount: { type: Number, default: 0 },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);