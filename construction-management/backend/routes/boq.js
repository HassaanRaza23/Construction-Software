const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const BOQItem = require('../models/BOQItem');
const Project = require('../models/Project');
const { authenticate, authorize, checkProjectAccess } = require('../middleware/auth');

// Get all BOQ items for a project
router.get('/project/:projectId', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const { category, status, phase } = req.query;
    const query = { project: req.params.projectId };
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (phase) query.phase = phase;
    
    const boqItems = await BOQItem.find(query)
      .sort({ category: 1, itemName: 1 });
    
    // Calculate totals
    const totals = {
      totalAmount: boqItems.reduce((sum, item) => sum + item.totalAmount, 0),
      totalOrdered: boqItems.reduce((sum, item) => sum + (item.orderedQuantity * item.ratePerUnit), 0),
      categories: {}
    };
    
    // Calculate category-wise totals
    boqItems.forEach(item => {
      if (!totals.categories[item.category]) {
        totals.categories[item.category] = {
          count: 0,
          totalAmount: 0,
          orderedAmount: 0
        };
      }
      
      totals.categories[item.category].count++;
      totals.categories[item.category].totalAmount += item.totalAmount;
      totals.categories[item.category].orderedAmount += item.orderedQuantity * item.ratePerUnit;
    });
    
    res.json({
      items: boqItems,
      totals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching BOQ items' });
  }
});

// Get single BOQ item
router.get('/:itemId', authenticate, async (req, res) => {
  try {
    const item = await BOQItem.findById(req.params.itemId)
      .populate('project', 'name');
    
    if (!item) {
      return res.status(404).json({ error: 'BOQ item not found' });
    }
    
    // Check project access
    req.body.projectId = item.project._id;
    await checkProjectAccess(req, res, () => {});
    
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching BOQ item' });
  }
});

// Create BOQ item
router.post('/', authenticate, authorize('admin', 'manager'), [
  body('project').notEmpty().withMessage('Project ID is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('itemName').notEmpty().withMessage('Item name is required'),
  body('unit').notEmpty().withMessage('Unit is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('ratePerUnit').isNumeric().withMessage('Rate per unit must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check project access
    req.body.projectId = req.body.project;
    await checkProjectAccess(req, res, () => {});
    
    // Calculate total amount
    req.body.totalAmount = req.body.quantity * req.body.ratePerUnit;
    
    const item = new BOQItem(req.body);
    await item.save();
    
    // Update project BOQ
    await Project.findByIdAndUpdate(req.body.project, {
      'boq.lastUpdated': new Date()
    });
    
    res.status(201).json({
      message: 'BOQ item created successfully',
      item
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating BOQ item' });
  }
});

// Update BOQ item
router.put('/:itemId', authenticate, authorize('admin', 'manager'), async (req, res) => {
  try {
    const item = await BOQItem.findById(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ error: 'BOQ item not found' });
    }
    
    // Check project access
    req.body.projectId = item.project;
    await checkProjectAccess(req, res, () => {});
    
    // Update fields
    Object.assign(item, req.body);
    
    // Recalculate total amount if quantity or rate changed
    if (req.body.quantity !== undefined || req.body.ratePerUnit !== undefined) {
      item.totalAmount = item.quantity * item.ratePerUnit;
    }
    
    await item.save();
    
    // Update project BOQ
    await Project.findByIdAndUpdate(item.project, {
      'boq.lastUpdated': new Date()
    });
    
    res.json({
      message: 'BOQ item updated successfully',
      item
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating BOQ item' });
  }
});

// Update BOQ item quantities
router.patch('/:itemId/quantities', authenticate, authorize('admin', 'manager', 'supervisor'), [
  body('orderedQuantity').optional().isNumeric(),
  body('receivedQuantity').optional().isNumeric(),
  body('usedQuantity').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const item = await BOQItem.findById(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ error: 'BOQ item not found' });
    }
    
    // Check project access
    req.body.projectId = item.project;
    await checkProjectAccess(req, res, () => {});
    
    // Update quantities
    if (req.body.orderedQuantity !== undefined) {
      item.orderedQuantity = req.body.orderedQuantity;
      if (req.body.orderDate) item.orderDate = req.body.orderDate;
    }
    
    if (req.body.receivedQuantity !== undefined) {
      item.receivedQuantity = req.body.receivedQuantity;
      if (req.body.deliveryDate) item.deliveryDate = req.body.deliveryDate;
    }
    
    if (req.body.usedQuantity !== undefined) {
      item.usedQuantity = req.body.usedQuantity;
    }
    
    // Update status based on quantities
    if (item.receivedQuantity >= item.quantity) {
      item.status = 'received';
    } else if (item.receivedQuantity > 0) {
      item.status = 'partial';
    } else if (item.orderedQuantity > 0) {
      item.status = 'ordered';
    }
    
    if (item.usedQuantity > 0 && item.usedQuantity < item.quantity) {
      item.status = 'in-use';
    } else if (item.usedQuantity >= item.quantity) {
      item.status = 'completed';
    }
    
    await item.save();
    
    res.json({
      message: 'BOQ item quantities updated successfully',
      item
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating BOQ item quantities' });
  }
});

// Delete BOQ item
router.delete('/:itemId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const item = await BOQItem.findById(req.params.itemId);
    
    if (!item) {
      return res.status(404).json({ error: 'BOQ item not found' });
    }
    
    // Check project access
    req.body.projectId = item.project;
    await checkProjectAccess(req, res, () => {});
    
    await item.deleteOne();
    
    // Update project BOQ
    await Project.findByIdAndUpdate(item.project, {
      'boq.lastUpdated': new Date()
    });
    
    res.json({ message: 'BOQ item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting BOQ item' });
  }
});

// Get BOQ summary for a project
router.get('/project/:projectId/summary', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const items = await BOQItem.find({ project: req.params.projectId });
    
    const summary = {
      totalItems: items.length,
      totalBudget: items.reduce((sum, item) => sum + item.totalAmount, 0),
      totalOrdered: items.reduce((sum, item) => sum + (item.orderedQuantity * item.ratePerUnit), 0),
      totalReceived: items.reduce((sum, item) => sum + (item.receivedQuantity * item.ratePerUnit), 0),
      totalUsed: items.reduce((sum, item) => sum + (item.usedQuantity * item.ratePerUnit), 0),
      byCategory: {},
      byStatus: {},
      criticalItems: []
    };
    
    // Group by category and status
    items.forEach(item => {
      // By category
      if (!summary.byCategory[item.category]) {
        summary.byCategory[item.category] = {
          count: 0,
          budget: 0,
          ordered: 0,
          received: 0,
          used: 0
        };
      }
      
      summary.byCategory[item.category].count++;
      summary.byCategory[item.category].budget += item.totalAmount;
      summary.byCategory[item.category].ordered += item.orderedQuantity * item.ratePerUnit;
      summary.byCategory[item.category].received += item.receivedQuantity * item.ratePerUnit;
      summary.byCategory[item.category].used += item.usedQuantity * item.ratePerUnit;
      
      // By status
      if (!summary.byStatus[item.status]) {
        summary.byStatus[item.status] = 0;
      }
      summary.byStatus[item.status]++;
      
      // Critical items (low stock)
      const remainingQuantity = item.quantity - item.usedQuantity;
      const remainingPercentage = (remainingQuantity / item.quantity) * 100;
      
      if (remainingPercentage < 20 && item.status !== 'completed') {
        summary.criticalItems.push({
          id: item._id,
          name: item.itemName,
          category: item.category,
          remainingQuantity,
          remainingPercentage: remainingPercentage.toFixed(2)
        });
      }
    });
    
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching BOQ summary' });
  }
});

module.exports = router;