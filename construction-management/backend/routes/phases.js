const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ConstructionPhase = require('../models/ConstructionPhase');
const Project = require('../models/Project');
const { authenticate, authorize, checkProjectAccess } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/phases/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Get all phases for a project
router.get('/project/:projectId', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const phases = await ConstructionPhase.find({ project: req.params.projectId })
      .sort({ floor: 1, createdAt: 1 });
    
    res.json(phases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching phases' });
  }
});

// Get single phase
router.get('/:phaseId', authenticate, async (req, res) => {
  try {
    const phase = await ConstructionPhase.findById(req.params.phaseId)
      .populate('project', 'name');
    
    if (!phase) {
      return res.status(404).json({ error: 'Phase not found' });
    }
    
    // Check project access
    req.body.projectId = phase.project._id;
    await checkProjectAccess(req, res, () => {});
    
    res.json(phase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching phase' });
  }
});

// Create new phase
router.post('/', authenticate, authorize('admin', 'manager'), [
  body('project').notEmpty().withMessage('Project ID is required'),
  body('phase').notEmpty().withMessage('Phase type is required'),
  body('floor').isNumeric().withMessage('Floor number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check project access
    req.body.projectId = req.body.project;
    await checkProjectAccess(req, res, () => {});
    
    const phase = new ConstructionPhase(req.body);
    await phase.save();
    
    res.status(201).json({
      message: 'Phase created successfully',
      phase
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating phase' });
  }
});

// Update phase
router.put('/:phaseId', authenticate, authorize('admin', 'manager', 'supervisor'), async (req, res) => {
  try {
    const phase = await ConstructionPhase.findById(req.params.phaseId);
    
    if (!phase) {
      return res.status(404).json({ error: 'Phase not found' });
    }
    
    // Check project access
    req.body.projectId = phase.project;
    await checkProjectAccess(req, res, () => {});
    
    // Update phase
    Object.assign(phase, req.body);
    
    // Calculate progress based on phase type
    if (phase.phase === 'grey-structure' && phase.greyStructure) {
      const gs = phase.greyStructure;
      const totalItems = (gs.columns.total || 0) + (gs.beams.total || 0);
      const completedItems = (gs.columns.completed || 0) + (gs.beams.completed || 0);
      
      if (totalItems > 0) {
        phase.progress = (completedItems / totalItems) * 100;
      }
      
      if (gs.slabs.chatBarhai.status === 'completed') {
        phase.progress = 100;
      }
    } else if (phase.phase === 'finishing' && phase.finishing) {
      // Calculate finishing progress
      const f = phase.finishing;
      let totalProgress = 0;
      let items = 0;
      
      // Check each finishing component
      const components = [
        f.walls.total > 0 ? (f.walls.completed / f.walls.total) * 100 : 0,
        f.electrical.wiringStatus === 'completed' ? 100 : (f.electrical.wiringStatus === 'in-progress' ? 50 : 0),
        f.plumbing.status === 'completed' ? 100 : (f.plumbing.status === 'in-progress' ? 50 : 0),
        f.gasLines.status === 'completed' ? 100 : (f.gasLines.status === 'in-progress' ? 50 : 0),
        f.doorFrames.total > 0 ? (f.doorFrames.installed / f.doorFrames.total) * 100 : 0,
        f.plastering.status === 'completed' ? 100 : (f.plastering.status === 'in-progress' ? 50 : 0),
        f.painting.status === 'completed' ? 100 : (f.painting.status === 'in-progress' ? 50 : 0),
        f.tiling.status === 'completed' ? 100 : (f.tiling.status === 'in-progress' ? 50 : 0)
      ];
      
      components.forEach(progress => {
        if (progress > 0 || items === 0) {
          totalProgress += progress;
          items++;
        }
      });
      
      phase.progress = items > 0 ? totalProgress / items : 0;
    }
    
    await phase.save();
    
    res.json({
      message: 'Phase updated successfully',
      phase
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating phase' });
  }
});

// Update phase status
router.patch('/:phaseId/status', authenticate, authorize('admin', 'manager', 'supervisor'), [
  body('status').isIn(['pending', 'in-progress', 'completed', 'on-hold']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const phase = await ConstructionPhase.findById(req.params.phaseId);
    
    if (!phase) {
      return res.status(404).json({ error: 'Phase not found' });
    }
    
    // Check project access
    req.body.projectId = phase.project;
    await checkProjectAccess(req, res, () => {});
    
    phase.status = req.body.status;
    
    if (req.body.status === 'in-progress' && !phase.startDate) {
      phase.startDate = new Date();
    }
    
    if (req.body.status === 'completed') {
      phase.completionDate = new Date();
      phase.progress = 100;
      
      if (phase.startDate) {
        phase.actualDuration = Math.ceil((phase.completionDate - phase.startDate) / (1000 * 60 * 60 * 24));
      }
    }
    
    await phase.save();
    
    res.json({
      message: 'Phase status updated successfully',
      phase
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating phase status' });
  }
});

// Add cube test result
router.post('/:phaseId/cube-test', 
  authenticate, 
  authorize('admin', 'manager', 'supervisor'),
  upload.single('report'),
  async (req, res) => {
    try {
      const phase = await ConstructionPhase.findById(req.params.phaseId);
      
      if (!phase) {
        return res.status(404).json({ error: 'Phase not found' });
      }
      
      // Check project access
      req.body.projectId = phase.project;
      await checkProjectAccess(req, res, () => {});
      
      const cubeTest = {
        testDate: req.body.testDate || new Date(),
        sampleLocation: req.body.sampleLocation,
        strength: req.body.strength,
        result: req.body.result,
        report: req.file ? req.file.path : null
      };
      
      phase.cubeTests.push(cubeTest);
      await phase.save();
      
      res.json({
        message: 'Cube test result added successfully',
        cubeTest
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding cube test result' });
    }
  }
);

// Add engineer inspection
router.post('/:phaseId/inspection', 
  authenticate, 
  authorize('admin', 'manager'),
  upload.single('report'),
  async (req, res) => {
    try {
      const phase = await ConstructionPhase.findById(req.params.phaseId);
      
      if (!phase) {
        return res.status(404).json({ error: 'Phase not found' });
      }
      
      // Check project access
      req.body.projectId = phase.project;
      await checkProjectAccess(req, res, () => {});
      
      const inspection = {
        inspectionDate: req.body.inspectionDate || new Date(),
        engineerType: req.body.engineerType,
        engineerName: req.body.engineerName,
        findings: req.body.findings,
        approved: req.body.approved === 'true',
        report: req.file ? req.file.path : null
      };
      
      phase.engineerInspections.push(inspection);
      await phase.save();
      
      res.json({
        message: 'Engineer inspection added successfully',
        inspection
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding engineer inspection' });
    }
  }
);

// Add photos to phase
router.post('/:phaseId/photos', 
  authenticate, 
  authorize('admin', 'manager', 'supervisor'),
  upload.array('photos', 10),
  async (req, res) => {
    try {
      const phase = await ConstructionPhase.findById(req.params.phaseId);
      
      if (!phase) {
        return res.status(404).json({ error: 'Phase not found' });
      }
      
      // Check project access
      req.body.projectId = phase.project;
      await checkProjectAccess(req, res, () => {});
      
      const photos = req.files.map(file => ({
        url: file.path,
        caption: req.body.caption || '',
        uploadDate: new Date()
      }));
      
      phase.photos.push(...photos);
      await phase.save();
      
      res.json({
        message: 'Photos uploaded successfully',
        photos
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error uploading photos' });
    }
  }
);

// Get phase timeline for a project
router.get('/project/:projectId/timeline', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const phases = await ConstructionPhase.find({ project: req.params.projectId })
      .select('phase floor status startDate completionDate estimatedDuration actualDuration progress')
      .sort({ floor: 1, createdAt: 1 });
    
    const timeline = phases.map(phase => ({
      id: phase._id,
      phase: phase.phase,
      floor: phase.floor,
      status: phase.status,
      startDate: phase.startDate,
      completionDate: phase.completionDate,
      estimatedDuration: phase.estimatedDuration,
      actualDuration: phase.actualDuration,
      progress: phase.progress,
      label: `${phase.phase} - Floor ${phase.floor}`
    }));
    
    res.json(timeline);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching phase timeline' });
  }
});

module.exports = router;