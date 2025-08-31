const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Project = require('../models/Project');
const { authenticate, authorize, checkProjectAccess } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/payments/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Get all payments for a project
router.get('/project/:projectId', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const { type, status, startDate, endDate } = req.query;
    const query = { project: req.params.projectId };
    
    if (type) query.type = type;
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }
    
    const payments = await Payment.find(query)
      .populate('approvedBy', 'name')
      .populate('relatedPhase', 'phase floor')
      .populate('relatedBOQItem', 'itemName category')
      .sort({ paymentDate: -1 });
    
    // Calculate totals
    const totals = {
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      byType: {},
      byStatus: {}
    };
    
    payments.forEach(payment => {
      // By type
      if (!totals.byType[payment.type]) {
        totals.byType[payment.type] = 0;
      }
      totals.byType[payment.type] += payment.amount;
      
      // By status
      if (!totals.byStatus[payment.status]) {
        totals.byStatus[payment.status] = 0;
      }
      totals.byStatus[payment.status] += payment.amount;
    });
    
    res.json({
      payments,
      totals
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching payments' });
  }
});

// Get single payment
router.get('/:paymentId', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('project', 'name')
      .populate('approvedBy', 'name email')
      .populate('relatedPhase')
      .populate('relatedBOQItem');
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    // Check project access
    req.body.projectId = payment.project._id;
    await checkProjectAccess(req, res, () => {});
    
    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching payment' });
  }
});

// Create payment
router.post('/', 
  authenticate, 
  authorize('admin', 'manager'),
  upload.single('receipt'),
  [
    body('project').notEmpty().withMessage('Project ID is required'),
    body('type').notEmpty().withMessage('Payment type is required'),
    body('paymentTo').notEmpty().withMessage('Payee is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('paymentDate').isISO8601().withMessage('Valid payment date is required')
  ], 
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      // Check project access
      req.body.projectId = req.body.project;
      await checkProjectAccess(req, res, () => {});
      
      const paymentData = {
        ...req.body,
        receipt: req.file ? req.file.path : null
      };
      
      const payment = new Payment(paymentData);
      await payment.save();
      
      // Update project spent amount if payment is paid
      if (payment.status === 'paid') {
        await Project.findByIdAndUpdate(payment.project, {
          $inc: { spentAmount: payment.amount }
        });
      }
      
      res.status(201).json({
        message: 'Payment created successfully',
        payment
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating payment' });
    }
  }
);

// Update payment
router.put('/:paymentId', 
  authenticate, 
  authorize('admin', 'manager'),
  upload.single('receipt'),
  async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.paymentId);
      
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
      
      // Check project access
      req.body.projectId = payment.project;
      await checkProjectAccess(req, res, () => {});
      
      const oldAmount = payment.amount;
      const oldStatus = payment.status;
      
      // Update payment
      Object.assign(payment, req.body);
      
      if (req.file) {
        payment.receipt = req.file.path;
      }
      
      await payment.save();
      
      // Update project spent amount
      if (oldStatus !== 'paid' && payment.status === 'paid') {
        // Payment was just marked as paid
        await Project.findByIdAndUpdate(payment.project, {
          $inc: { spentAmount: payment.amount }
        });
      } else if (oldStatus === 'paid' && payment.status !== 'paid') {
        // Payment was unmarked as paid
        await Project.findByIdAndUpdate(payment.project, {
          $inc: { spentAmount: -oldAmount }
        });
      } else if (oldStatus === 'paid' && payment.status === 'paid' && oldAmount !== payment.amount) {
        // Amount changed for a paid payment
        await Project.findByIdAndUpdate(payment.project, {
          $inc: { spentAmount: payment.amount - oldAmount }
        });
      }
      
      res.json({
        message: 'Payment updated successfully',
        payment
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating payment' });
    }
  }
);

// Approve payment
router.patch('/:paymentId/approve', authenticate, authorize('admin', 'manager'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    // Check project access
    req.body.projectId = payment.project;
    await checkProjectAccess(req, res, () => {});
    
    if (payment.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending payments can be approved' });
    }
    
    payment.status = 'approved';
    payment.approvedBy = req.user._id;
    
    await payment.save();
    
    res.json({
      message: 'Payment approved successfully',
      payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error approving payment' });
  }
});

// Mark payment as paid
router.patch('/:paymentId/paid', authenticate, authorize('admin', 'manager'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    // Check project access
    req.body.projectId = payment.project;
    await checkProjectAccess(req, res, () => {});
    
    if (payment.status === 'pending') {
      return res.status(400).json({ error: 'Payment must be approved first' });
    }
    
    if (payment.status === 'paid') {
      return res.status(400).json({ error: 'Payment is already marked as paid' });
    }
    
    payment.status = 'paid';
    
    if (req.body.referenceNumber) {
      payment.referenceNumber = req.body.referenceNumber;
    }
    
    await payment.save();
    
    // Update project spent amount
    await Project.findByIdAndUpdate(payment.project, {
      $inc: { spentAmount: payment.amount }
    });
    
    res.json({
      message: 'Payment marked as paid successfully',
      payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error marking payment as paid' });
  }
});

// Delete payment
router.delete('/:paymentId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    // Check project access
    req.body.projectId = payment.project;
    await checkProjectAccess(req, res, () => {});
    
    // Update project spent amount if payment was paid
    if (payment.status === 'paid') {
      await Project.findByIdAndUpdate(payment.project, {
        $inc: { spentAmount: -payment.amount }
      });
    }
    
    await payment.deleteOne();
    
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting payment' });
  }
});

// Get payment summary for a project
router.get('/project/:projectId/summary', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const payments = await Payment.find({ 
      project: req.params.projectId,
      status: 'paid'
    });
    
    const project = await Project.findById(req.params.projectId);
    
    const summary = {
      totalBudget: project.totalBudget,
      totalSpent: payments.reduce((sum, p) => sum + p.amount, 0),
      remainingBudget: 0,
      budgetUtilization: 0,
      byType: {},
      byMonth: {},
      recentPayments: []
    };
    
    summary.remainingBudget = summary.totalBudget - summary.totalSpent;
    summary.budgetUtilization = summary.totalBudget > 0 
      ? ((summary.totalSpent / summary.totalBudget) * 100).toFixed(2)
      : 0;
    
    // Group by type
    payments.forEach(payment => {
      if (!summary.byType[payment.type]) {
        summary.byType[payment.type] = {
          count: 0,
          amount: 0,
          percentage: 0
        };
      }
      
      summary.byType[payment.type].count++;
      summary.byType[payment.type].amount += payment.amount;
    });
    
    // Calculate percentages
    Object.keys(summary.byType).forEach(type => {
      summary.byType[type].percentage = summary.totalSpent > 0
        ? ((summary.byType[type].amount / summary.totalSpent) * 100).toFixed(2)
        : 0;
    });
    
    // Group by month
    payments.forEach(payment => {
      const monthKey = payment.paymentDate.toISOString().slice(0, 7);
      
      if (!summary.byMonth[monthKey]) {
        summary.byMonth[monthKey] = 0;
      }
      
      summary.byMonth[monthKey] += payment.amount;
    });
    
    // Get recent payments
    summary.recentPayments = await Payment.find({ 
      project: req.params.projectId 
    })
    .populate('approvedBy', 'name')
    .sort({ paymentDate: -1 })
    .limit(10);
    
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching payment summary' });
  }
});

module.exports = router;