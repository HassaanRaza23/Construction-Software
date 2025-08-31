const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('assignedProjects', 'name status')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Get single user
router.get('/:userId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('assignedProjects', 'name status location');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Update user
router.put('/:userId', authenticate, authorize('admin'), [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('role').optional().isIn(['admin', 'manager', 'supervisor', 'viewer']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Don't allow password updates through this route
    delete req.body.password;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Assign projects to user
router.post('/:userId/assign-projects', authenticate, authorize('admin'), [
  body('projectIds').isArray().withMessage('Project IDs must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.assignedProjects = req.body.projectIds;
    await user.save();
    
    res.json({
      message: 'Projects assigned successfully',
      assignedProjects: user.assignedProjects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error assigning projects' });
  }
});

// Toggle user status
router.patch('/:userId/toggle-status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      isActive: user.isActive
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error toggling user status' });
  }
});

// Delete user
router.delete('/:userId', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't allow deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last admin user' });
      }
    }
    
    await user.deleteOne();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Get user statistics
router.get('/stats/overview', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find();
    
    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      inactiveUsers: users.filter(u => !u.isActive).length,
      byRole: {},
      recentLogins: []
    };
    
    // Count by role
    users.forEach(user => {
      if (!stats.byRole[user.role]) {
        stats.byRole[user.role] = 0;
      }
      stats.byRole[user.role]++;
    });
    
    // Get recent logins
    stats.recentLogins = users
      .filter(u => u.lastLogin)
      .sort((a, b) => b.lastLogin - a.lastLogin)
      .slice(0, 10)
      .map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        lastLogin: u.lastLogin
      }));
    
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching user statistics' });
  }
});

module.exports = router;