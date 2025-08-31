const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const ConstructionPhase = require('../models/ConstructionPhase');
const { authenticate, authorize, checkProjectAccess } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Get all projects
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};
    
    // If not admin, only show assigned projects
    if (req.user.role !== 'admin') {
      query._id = { $in: req.user.assignedProjects };
    }
    
    // Add filters
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    const projects = await Project.find(query)
      .select('-__v')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

// Get single project
router.get('/:projectId', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('createdBy', 'name email');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching project' });
  }
});

// Create new project
router.post('/', authenticate, authorize('admin', 'manager'), [
  body('name').notEmpty().withMessage('Project name is required'),
  body('location.address').notEmpty().withMessage('Location is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const project = new Project({
      ...req.body,
      createdBy: req.user._id
    });
    
    await project.save();
    
    // Initialize construction phases
    const phases = [
      { phase: 'piling', floor: 0 },
      { phase: 'raft', floor: 0 },
      { phase: 'plinth', floor: 0 }
    ];
    
    for (const phaseData of phases) {
      const phase = new ConstructionPhase({
        project: project._id,
        ...phaseData
      });
      await phase.save();
    }
    
    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating project' });
  }
});

// Update project
router.put('/:projectId', authenticate, authorize('admin', 'manager'), checkProjectAccess, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating project' });
  }
});

// Update project status
router.patch('/:projectId/status', authenticate, authorize('admin', 'manager'), checkProjectAccess, [
  body('status').notEmpty().withMessage('Status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const project = await Project.findByIdAndUpdate(
      req.params.projectId,
      { status: req.body.status },
      { new: true }
    );
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({
      message: 'Project status updated successfully',
      project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating project status' });
  }
});

// Upload documents
router.post('/:projectId/upload/:documentType', 
  authenticate, 
  authorize('admin', 'manager'), 
  checkProjectAccess,
  upload.single('document'),
  async (req, res) => {
    try {
      const { projectId, documentType } = req.params;
      const filePath = req.file.path;
      
      const updateData = {};
      
      // Map document types to project fields
      switch (documentType) {
        case 'site-plan':
          updateData['landSurvey.sitePlan'] = filePath;
          break;
        case 'soil-test':
          updateData['soilTest.report'] = filePath;
          break;
        case 'proposed-plan':
          updateData['architect.proposedPlan'] = filePath;
          break;
        case 'boq':
          updateData['boq.document'] = filePath;
          break;
        case 'contract':
          updateData['contractor.contractDocument'] = filePath;
          break;
        default:
          return res.status(400).json({ error: 'Invalid document type' });
      }
      
      const project = await Project.findByIdAndUpdate(
        projectId,
        updateData,
        { new: true }
      );
      
      res.json({
        message: 'Document uploaded successfully',
        filePath
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error uploading document' });
    }
  }
);

// Get project statistics
router.get('/:projectId/stats', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    const [project, phases, payments] = await Promise.all([
      Project.findById(projectId),
      ConstructionPhase.find({ project: projectId }),
      require('../models/Payment').find({ project: projectId, status: 'paid' })
    ]);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Calculate statistics
    const totalPhases = phases.length;
    const completedPhases = phases.filter(p => p.status === 'completed').length;
    const progressPercentage = totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0;
    
    const totalSpent = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const budgetUtilization = project.totalBudget > 0 ? (totalSpent / project.totalBudget) * 100 : 0;
    
    res.json({
      projectName: project.name,
      status: project.status,
      progress: {
        percentage: progressPercentage.toFixed(2),
        completedPhases,
        totalPhases
      },
      financial: {
        totalBudget: project.totalBudget,
        totalSpent,
        remaining: project.totalBudget - totalSpent,
        utilizationPercentage: budgetUtilization.toFixed(2)
      },
      phases: {
        pending: phases.filter(p => p.status === 'pending').length,
        inProgress: phases.filter(p => p.status === 'in-progress').length,
        completed: completedPhases,
        onHold: phases.filter(p => p.status === 'on-hold').length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching project statistics' });
  }
});

module.exports = router;