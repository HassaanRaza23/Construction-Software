const mongoose = require('mongoose');

const constructionPhaseSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  phase: {
    type: String,
    enum: ['piling', 'raft', 'plinth', 'grey-structure', 'finishing', 'elevation', 'final-checks'],
    required: true
  },
  floor: {
    type: Number,
    default: 0 // 0 for foundation work (piling, raft, plinth)
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'on-hold'],
    default: 'pending'
  },
  startDate: Date,
  completionDate: Date,
  estimatedDuration: Number, // in days
  actualDuration: Number,
  
  // Specific to each phase
  pilingDetails: {
    numberOfPiles: Number,
    depth: Number,
    diameter: Number,
    completedPiles: Number
  },
  
  raftDetails: {
    thickness: Number,
    area: Number,
    concreteGrade: String
  },
  
  plinthDetails: {
    height: Number,
    beamDetails: String
  },
  
  greyStructure: {
    columns: {
      total: Number,
      completed: Number
    },
    beams: {
      total: Number,
      completed: Number
    },
    slabs: {
      area: Number,
      thickness: Number,
      chatBarhai: {
        status: {
          type: String,
          enum: ['pending', 'in-progress', 'completed'],
          default: 'pending'
        },
        completionDate: Date
      }
    }
  },
  
  finishing: {
    walls: {
      total: Number,
      completed: Number
    },
    electrical: {
      wiringStatus: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
      },
      switchBoardsInstalled: Number,
      mainBoardInstalled: Boolean
    },
    plumbing: {
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
      },
      pipesInstalled: Boolean,
      fixturesInstalled: Boolean
    },
    gasLines: {
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
      }
    },
    doorFrames: {
      total: Number,
      installed: Number
    },
    plastering: {
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
      },
      area: Number
    },
    painting: {
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
      },
      coats: Number
    },
    tiling: {
      status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
      },
      area: Number
    },
    fittings: {
      doors: { installed: Number, total: Number },
      windows: { installed: Number, total: Number },
      lights: { installed: Number, total: Number },
      switches: { installed: Number, total: Number },
      sanitaryItems: { installed: Number, total: Number }
    }
  },
  
  elevation: {
    plasteringStatus: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    paintingStatus: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    }
  },
  
  cubeTests: [{
    testDate: Date,
    sampleLocation: String,
    strength: Number,
    result: {
      type: String,
      enum: ['pass', 'fail']
    },
    report: String // file path
  }],
  
  engineerInspections: [{
    inspectionDate: Date,
    engineerType: {
      type: String,
      enum: ['structural', 'electrical', 'plumbing', 'hvac']
    },
    engineerName: String,
    findings: String,
    approved: Boolean,
    report: String // file path
  }],
  
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  notes: String,
  issues: [{
    date: Date,
    description: String,
    resolved: Boolean,
    resolutionDate: Date
  }],
  
  photos: [{
    url: String,
    caption: String,
    uploadDate: Date
  }]
}, {
  timestamps: true
});

// Index for efficient querying
constructionPhaseSchema.index({ project: 1, phase: 1, floor: 1 });

module.exports = mongoose.model('ConstructionPhase', constructionPhaseSchema);