const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const ConstructionPhase = require('../models/ConstructionPhase');
const Payment = require('../models/Payment');
const BOQItem = require('../models/BOQItem');
const { authenticate, authorize, checkProjectAccess } = require('../middleware/auth');

// Get project overview report
router.get('/project/:projectId/overview', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    
    const [project, phases, payments, boqItems] = await Promise.all([
      Project.findById(projectId).populate('createdBy', 'name'),
      ConstructionPhase.find({ project: projectId }),
      Payment.find({ project: projectId, status: 'paid' }),
      BOQItem.find({ project: projectId })
    ]);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Calculate phase progress
    const phaseProgress = {
      total: phases.length,
      completed: phases.filter(p => p.status === 'completed').length,
      inProgress: phases.filter(p => p.status === 'in-progress').length,
      pending: phases.filter(p => p.status === 'pending').length,
      onHold: phases.filter(p => p.status === 'on-hold').length
    };
    
    // Calculate financial summary
    const financialSummary = {
      totalBudget: project.totalBudget,
      totalSpent: payments.reduce((sum, p) => sum + p.amount, 0),
      landCosts: project.landDetails.purchaseAmount + project.landDetails.transferFees + project.landDetails.legalFees,
      constructionCosts: payments
        .filter(p => ['contractor', 'material', 'labor'].includes(p.type))
        .reduce((sum, p) => sum + p.amount, 0),
      consultantCosts: payments
        .filter(p => p.type === 'consultant')
        .reduce((sum, p) => sum + p.amount, 0)
    };
    
    financialSummary.remainingBudget = financialSummary.totalBudget - financialSummary.totalSpent;
    financialSummary.budgetUtilization = financialSummary.totalBudget > 0
      ? (financialSummary.totalSpent / financialSummary.totalBudget) * 100
      : 0;
    
    // Calculate BOQ summary
    const boqSummary = {
      totalItems: boqItems.length,
      totalValue: boqItems.reduce((sum, item) => sum + item.totalAmount, 0),
      orderedValue: boqItems.reduce((sum, item) => sum + (item.orderedQuantity * item.ratePerUnit), 0),
      receivedValue: boqItems.reduce((sum, item) => sum + (item.receivedQuantity * item.ratePerUnit), 0),
      usedValue: boqItems.reduce((sum, item) => sum + (item.usedQuantity * item.ratePerUnit), 0)
    };
    
    // Timeline calculation
    const timeline = {
      projectStartDate: project.startDate,
      estimatedEndDate: project.estimatedEndDate,
      actualEndDate: project.actualEndDate,
      elapsedDays: project.startDate 
        ? Math.ceil((new Date() - new Date(project.startDate)) / (1000 * 60 * 60 * 24))
        : 0,
      remainingDays: project.estimatedEndDate
        ? Math.ceil((new Date(project.estimatedEndDate) - new Date()) / (1000 * 60 * 60 * 24))
        : 0
    };
    
    // Current status
    const currentPhases = phases.filter(p => p.status === 'in-progress');
    
    res.json({
      project: {
        name: project.name,
        location: project.location,
        status: project.status,
        createdBy: project.createdBy?.name
      },
      phaseProgress,
      financialSummary,
      boqSummary,
      timeline,
      currentPhases: currentPhases.map(p => ({
        phase: p.phase,
        floor: p.floor,
        progress: p.progress,
        startDate: p.startDate
      })),
      approvals: project.approvals,
      team: {
        architect: project.architect?.name,
        contractor: project.contractor?.name,
        engineers: project.engineers.map(e => ({ type: e.type, name: e.name })),
        supervisors: project.supervisors.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating project overview report' });
  }
});

// Get progress report
router.get('/project/:projectId/progress', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { startDate, endDate } = req.query;
    
    const query = { project: projectId };
    if (startDate || endDate) {
      query.updatedAt = {};
      if (startDate) query.updatedAt.$gte = new Date(startDate);
      if (endDate) query.updatedAt.$lte = new Date(endDate);
    }
    
    const phases = await ConstructionPhase.find(query)
      .sort({ floor: 1, createdAt: 1 });
    
    // Group phases by floor
    const progressByFloor = {};
    phases.forEach(phase => {
      if (!progressByFloor[phase.floor]) {
        progressByFloor[phase.floor] = {
          floor: phase.floor,
          phases: [],
          overallProgress: 0
        };
      }
      
      progressByFloor[phase.floor].phases.push({
        phase: phase.phase,
        status: phase.status,
        progress: phase.progress,
        startDate: phase.startDate,
        completionDate: phase.completionDate,
        estimatedDuration: phase.estimatedDuration,
        actualDuration: phase.actualDuration,
        cubeTests: phase.cubeTests.length,
        inspections: phase.engineerInspections.length,
        issues: phase.issues.filter(i => !i.resolved).length
      });
    });
    
    // Calculate overall progress per floor
    Object.values(progressByFloor).forEach(floor => {
      const totalProgress = floor.phases.reduce((sum, p) => sum + p.progress, 0);
      floor.overallProgress = floor.phases.length > 0 
        ? totalProgress / floor.phases.length 
        : 0;
    });
    
    // Get recent activities
    const recentActivities = phases
      .filter(p => p.updatedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .map(p => ({
        phase: p.phase,
        floor: p.floor,
        activity: `${p.phase} - Floor ${p.floor}`,
        status: p.status,
        progress: p.progress,
        updatedAt: p.updatedAt
      }))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 20);
    
    res.json({
      progressByFloor,
      totalFloors: Object.keys(progressByFloor).length,
      completedFloors: Object.values(progressByFloor).filter(f => 
        f.phases.every(p => p.status === 'completed')
      ).length,
      recentActivities,
      criticalPhases: phases.filter(p => 
        p.status === 'in-progress' && 
        p.estimatedDuration && 
        p.startDate &&
        Math.ceil((new Date() - new Date(p.startDate)) / (1000 * 60 * 60 * 24)) > p.estimatedDuration
      ).map(p => ({
        phase: p.phase,
        floor: p.floor,
        delayDays: Math.ceil((new Date() - new Date(p.startDate)) / (1000 * 60 * 60 * 24)) - p.estimatedDuration,
        progress: p.progress
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating progress report' });
  }
});

// Get financial report
router.get('/project/:projectId/financial', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { startDate, endDate } = req.query;
    
    const query = { project: projectId, status: 'paid' };
    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }
    
    const [project, payments, boqItems] = await Promise.all([
      Project.findById(projectId),
      Payment.find(query).sort({ paymentDate: -1 }),
      BOQItem.find({ project: projectId })
    ]);
    
    // Payment analysis
    const paymentAnalysis = {
      totalPayments: payments.length,
      totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
      byType: {},
      byMonth: {},
      byCategory: {}
    };
    
    // Group by type
    payments.forEach(payment => {
      if (!paymentAnalysis.byType[payment.type]) {
        paymentAnalysis.byType[payment.type] = {
          count: 0,
          amount: 0
        };
      }
      paymentAnalysis.byType[payment.type].count++;
      paymentAnalysis.byType[payment.type].amount += payment.amount;
      
      // Group by month
      const monthKey = payment.paymentDate.toISOString().slice(0, 7);
      if (!paymentAnalysis.byMonth[monthKey]) {
        paymentAnalysis.byMonth[monthKey] = 0;
      }
      paymentAnalysis.byMonth[monthKey] += payment.amount;
      
      // Group by category
      if (!paymentAnalysis.byCategory[payment.category]) {
        paymentAnalysis.byCategory[payment.category] = 0;
      }
      paymentAnalysis.byCategory[payment.category] += payment.amount;
    });
    
    // BOQ analysis
    const boqAnalysis = {
      totalBudget: boqItems.reduce((sum, item) => sum + item.totalAmount, 0),
      orderedAmount: boqItems.reduce((sum, item) => sum + (item.orderedQuantity * item.ratePerUnit), 0),
      receivedAmount: boqItems.reduce((sum, item) => sum + (item.receivedQuantity * item.ratePerUnit), 0),
      usedAmount: boqItems.reduce((sum, item) => sum + (item.usedQuantity * item.ratePerUnit), 0),
      byCategory: {}
    };
    
    // BOQ by category
    boqItems.forEach(item => {
      if (!boqAnalysis.byCategory[item.category]) {
        boqAnalysis.byCategory[item.category] = {
          count: 0,
          budget: 0,
          ordered: 0,
          received: 0,
          used: 0
        };
      }
      
      const cat = boqAnalysis.byCategory[item.category];
      cat.count++;
      cat.budget += item.totalAmount;
      cat.ordered += item.orderedQuantity * item.ratePerUnit;
      cat.received += item.receivedQuantity * item.ratePerUnit;
      cat.used += item.usedQuantity * item.ratePerUnit;
    });
    
    // Cost breakdown
    const costBreakdown = {
      landAcquisition: project.landDetails.purchaseAmount + project.landDetails.transferFees + project.landDetails.legalFees,
      construction: payments.filter(p => ['contractor', 'material', 'labor'].includes(p.type)).reduce((sum, p) => sum + p.amount, 0),
      consultants: payments.filter(p => p.type === 'consultant').reduce((sum, p) => sum + p.amount, 0),
      approvals: payments.filter(p => p.type === 'approval-fee').reduce((sum, p) => sum + p.amount, 0),
      others: payments.filter(p => p.type === 'other').reduce((sum, p) => sum + p.amount, 0)
    };
    
    costBreakdown.total = Object.values(costBreakdown).reduce((sum, val) => sum + val, 0);
    
    res.json({
      projectBudget: project.totalBudget,
      totalSpent: paymentAnalysis.totalAmount,
      remainingBudget: project.totalBudget - paymentAnalysis.totalAmount,
      budgetUtilization: project.totalBudget > 0 
        ? ((paymentAnalysis.totalAmount / project.totalBudget) * 100).toFixed(2)
        : 0,
      paymentAnalysis,
      boqAnalysis,
      costBreakdown,
      cashFlow: paymentAnalysis.byMonth,
      pendingPayments: await Payment.countDocuments({ project: projectId, status: { $ne: 'paid' } }),
      upcomingPayments: await Payment.find({ 
        project: projectId, 
        status: 'approved',
        paymentDate: { $gte: new Date() }
      }).limit(10)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating financial report' });
  }
});

// Get quality report
router.get('/project/:projectId/quality', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const phases = await ConstructionPhase.find({ project: req.params.projectId });
    
    // Collect all quality data
    const qualityData = {
      cubeTests: {
        total: 0,
        passed: 0,
        failed: 0,
        byPhase: {}
      },
      inspections: {
        total: 0,
        approved: 0,
        rejected: 0,
        byType: {}
      },
      issues: {
        total: 0,
        resolved: 0,
        pending: 0,
        byPhase: {}
      }
    };
    
    phases.forEach(phase => {
      // Cube tests
      phase.cubeTests.forEach(test => {
        qualityData.cubeTests.total++;
        if (test.result === 'pass') {
          qualityData.cubeTests.passed++;
        } else {
          qualityData.cubeTests.failed++;
        }
        
        const phaseKey = `${phase.phase}-Floor${phase.floor}`;
        if (!qualityData.cubeTests.byPhase[phaseKey]) {
          qualityData.cubeTests.byPhase[phaseKey] = { passed: 0, failed: 0 };
        }
        
        if (test.result === 'pass') {
          qualityData.cubeTests.byPhase[phaseKey].passed++;
        } else {
          qualityData.cubeTests.byPhase[phaseKey].failed++;
        }
      });
      
      // Inspections
      phase.engineerInspections.forEach(inspection => {
        qualityData.inspections.total++;
        if (inspection.approved) {
          qualityData.inspections.approved++;
        } else {
          qualityData.inspections.rejected++;
        }
        
        if (!qualityData.inspections.byType[inspection.engineerType]) {
          qualityData.inspections.byType[inspection.engineerType] = { approved: 0, rejected: 0 };
        }
        
        if (inspection.approved) {
          qualityData.inspections.byType[inspection.engineerType].approved++;
        } else {
          qualityData.inspections.byType[inspection.engineerType].rejected++;
        }
      });
      
      // Issues
      phase.issues.forEach(issue => {
        qualityData.issues.total++;
        if (issue.resolved) {
          qualityData.issues.resolved++;
        } else {
          qualityData.issues.pending++;
        }
        
        const phaseKey = `${phase.phase}-Floor${phase.floor}`;
        if (!qualityData.issues.byPhase[phaseKey]) {
          qualityData.issues.byPhase[phaseKey] = { resolved: 0, pending: 0 };
        }
        
        if (issue.resolved) {
          qualityData.issues.byPhase[phaseKey].resolved++;
        } else {
          qualityData.issues.byPhase[phaseKey].pending++;
        }
      });
    });
    
    // Calculate pass rates
    qualityData.cubeTests.passRate = qualityData.cubeTests.total > 0
      ? ((qualityData.cubeTests.passed / qualityData.cubeTests.total) * 100).toFixed(2)
      : 0;
      
    qualityData.inspections.approvalRate = qualityData.inspections.total > 0
      ? ((qualityData.inspections.approved / qualityData.inspections.total) * 100).toFixed(2)
      : 0;
      
    qualityData.issues.resolutionRate = qualityData.issues.total > 0
      ? ((qualityData.issues.resolved / qualityData.issues.total) * 100).toFixed(2)
      : 0;
    
    // Get recent quality events
    const recentEvents = [];
    
    phases.forEach(phase => {
      phase.cubeTests.forEach(test => {
        if (test.testDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
          recentEvents.push({
            type: 'cube-test',
            date: test.testDate,
            phase: `${phase.phase} - Floor ${phase.floor}`,
            result: test.result,
            details: `Strength: ${test.strength}`
          });
        }
      });
      
      phase.engineerInspections.forEach(inspection => {
        if (inspection.inspectionDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
          recentEvents.push({
            type: 'inspection',
            date: inspection.inspectionDate,
            phase: `${phase.phase} - Floor ${phase.floor}`,
            result: inspection.approved ? 'approved' : 'rejected',
            details: `${inspection.engineerType} - ${inspection.engineerName}`
          });
        }
      });
    });
    
    recentEvents.sort((a, b) => b.date - a.date);
    
    res.json({
      qualityData,
      recentEvents: recentEvents.slice(0, 20),
      criticalIssues: phases
        .flatMap(p => p.issues.filter(i => !i.resolved).map(i => ({
          phase: `${p.phase} - Floor ${p.floor}`,
          description: i.description,
          date: i.date
        })))
        .sort((a, b) => b.date - a.date)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating quality report' });
  }
});

// Export report data
router.get('/project/:projectId/export', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { format = 'json' } = req.query;
    
    const [project, phases, payments, boqItems] = await Promise.all([
      Project.findById(projectId)
        .populate('createdBy', 'name email')
        .populate('engineers')
        .populate('supervisors'),
      ConstructionPhase.find({ project: projectId }),
      Payment.find({ project: projectId }),
      BOQItem.find({ project: projectId })
    ]);
    
    const exportData = {
      project,
      phases,
      payments,
      boqItems,
      exportDate: new Date(),
      exportedBy: req.user.name
    };
    
    if (format === 'json') {
      res.json(exportData);
    } else {
      res.status(400).json({ error: 'Unsupported export format' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error exporting report data' });
  }
});

module.exports = router;