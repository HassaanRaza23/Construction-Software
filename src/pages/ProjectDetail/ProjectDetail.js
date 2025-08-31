import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Chip,
  LinearProgress,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Engineering as EngineeringIcon,
  Construction as ConstructionIcon,
  Home as HomeIcon,
  Foundation as FoundationIcon,
  Check as CheckIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';

// Mock project data - this would come from your database
const mockProjectData = {
  id: 1,
  name: 'Alpha Residency',
  location: 'DHA Phase 6, Karachi',
  client: 'ABC Developers',
  startDate: '2024-01-15',
  endDate: '2025-06-30',
  budget: 'PKR 250,000,000',
  currentPhase: 'Grey Structure - Floor 3',
  progress: 75,
  status: 'active',
  phase: 'construction',
  subPhase: 'grey_structure',
  floor: 3,
  totalFloors: 8,
  contractor: 'XYZ Construction',
  architect: 'Design Studio',
  engineer: 'Structural Solutions',
  lastUpdated: '2024-12-19',
  nextMilestone: 'Floor 3 Chhat Barhai',
  nextMilestoneDate: '2024-12-25',
  
  // Construction phases and milestones
  phases: [
    {
      id: 'planning',
      name: 'Planning & Feasibility',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      milestones: [
        { id: 1, name: 'Land Survey Completed', status: 'completed', date: '2024-01-20' },
        { id: 2, name: 'Soil Testing Completed', status: 'completed', date: '2024-02-01' },
        { id: 3, name: 'Architectural Plan Approved', status: 'completed', date: '2024-02-15' },
        { id: 4, name: 'Sale NOC Received', status: 'completed', date: '2024-03-10' },
      ]
    },
    {
      id: 'foundation',
      name: 'Foundation Work',
      status: 'completed',
      progress: 100,
      startDate: '2024-03-16',
      endDate: '2024-05-15',
      milestones: [
        { id: 5, name: 'Piling Work Completed', status: 'completed', date: '2024-04-01' },
        { id: 6, name: 'Raft Foundation Completed', status: 'completed', date: '2024-04-20' },
        { id: 7, name: 'Plinth Completed', status: 'completed', date: '2024-05-10' },
        { id: 8, name: 'Plinth Verification Approved', status: 'completed', date: '2024-05-15' },
      ]
    },
    {
      id: 'construction',
      name: 'Construction',
      status: 'active',
      progress: 75,
      startDate: '2024-05-16',
      endDate: '2025-05-15',
      milestones: [
        { id: 9, name: 'Ground Floor Grey Structure', status: 'completed', date: '2024-06-15' },
        { id: 10, name: 'Ground Floor Finishing', status: 'completed', date: '2024-07-30' },
        { id: 11, name: '1st Floor Grey Structure', status: 'completed', date: '2024-08-30' },
        { id: 12, name: '1st Floor Finishing', status: 'completed', date: '2024-10-15' },
        { id: 13, name: '2nd Floor Grey Structure', status: 'completed', date: '2024-11-15' },
        { id: 14, name: '2nd Floor Finishing', status: 'completed', date: '2024-12-10' },
        { id: 15, name: '3rd Floor Grey Structure', status: 'in_progress', date: '2024-12-19' },
        { id: 16, name: '3rd Floor Finishing', status: 'pending', date: null },
        { id: 17, name: '4th Floor Grey Structure', status: 'pending', date: null },
        { id: 18, name: '4th Floor Finishing', status: 'pending', date: null },
        { id: 19, name: '5th Floor Grey Structure', status: 'pending', date: null },
        { id: 20, name: '5th Floor Finishing', status: 'pending', date: null },
        { id: 21, name: '6th Floor Grey Structure', status: 'pending', date: null },
        { id: 22, name: '6th Floor Finishing', status: 'pending', date: null },
        { id: 23, name: '7th Floor Grey Structure', status: 'pending', date: null },
        { id: 24, name: '7th Floor Finishing', status: 'pending', date: null },
      ]
    },
    {
      id: 'elevation',
      name: 'Elevation & Final Work',
      status: 'pending',
      progress: 0,
      startDate: '2025-05-16',
      endDate: '2025-06-15',
      milestones: [
        { id: 25, name: 'Elevation Plastering', status: 'pending', date: null },
        { id: 26, name: 'Elevation Painting', status: 'pending', date: null },
        { id: 27, name: 'Final Inspections', status: 'pending', date: null },
        { id: 28, name: 'Project Handover', status: 'pending', date: null },
      ]
    }
  ],
  
  // Current tasks
  currentTasks: [
    {
      id: 1,
      name: '3rd Floor Column Work',
      description: 'Complete RCC columns for 3rd floor',
      assignedTo: 'Site Engineer',
      dueDate: '2024-12-22',
      status: 'in_progress',
      priority: 'high',
      progress: 60,
    },
    {
      id: 2,
      name: '2nd Floor Tiling',
      description: 'Complete bathroom and kitchen tiling',
      assignedTo: 'Tiling Team',
      dueDate: '2024-12-25',
      status: 'in_progress',
      priority: 'medium',
      progress: 40,
    },
    {
      id: 3,
      name: 'Material Procurement',
      description: 'Order steel and cement for next phase',
      assignedTo: 'Procurement Team',
      dueDate: '2024-12-20',
      status: 'pending',
      priority: 'high',
      progress: 0,
    },
  ],
  
  // Quality control records
  qualityChecks: [
    {
      id: 1,
      type: 'Cube Test',
      description: '3rd Floor Concrete Cube Test',
      date: '2024-12-18',
      result: 'Passed',
      engineer: 'Structural Engineer',
      notes: 'All cubes passed strength test',
    },
    {
      id: 2,
      type: 'Engineer Inspection',
      description: '2nd Floor Finishing Inspection',
      date: '2024-12-15',
      result: 'Passed with minor corrections',
      engineer: 'Civil Engineer',
      notes: 'Minor touch-ups required in bathrooms',
    },
    {
      id: 3,
      type: 'Material Test',
      description: 'Steel Quality Test',
      date: '2024-12-10',
      result: 'Passed',
      engineer: 'Quality Engineer',
      notes: 'Steel meets all specifications',
    },
  ],
  
  // Financial tracking
  financials: {
    totalBudget: 250000000,
    spent: 187500000,
    committed: 200000000,
    remaining: 62500000,
    breakdown: {
      land: 50000000,
      approvals: 10000000,
      foundation: 30000000,
      construction: 97500000,
      finishing: 0,
    }
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'primary';
    case 'pending': return 'warning';
    case 'delayed': return 'error';
    default: return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed': return <CheckCircleIcon />;
    case 'in_progress': return <ScheduleIcon />;
    case 'pending': return <PendingIcon />;
    case 'delayed': return <WarningIcon />;
    default: return <PendingIcon />;
  }
};

const PhaseCard = ({ phase, isActive }) => (
  <Card sx={{ mb: 2, border: isActive ? '2px solid' : '1px solid', borderColor: isActive ? 'primary.main' : 'divider' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {phase.name}
        </Typography>
        <Chip 
          label={phase.status.replace('_', ' ').toUpperCase()} 
          color={getStatusColor(phase.status)}
          size="small"
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">Progress</Typography>
          <Typography variant="body2" color="primary.main" fontWeight="bold">
            {phase.progress}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={phase.progress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Milestones ({phase.milestones.filter(m => m.status === 'completed').length}/{phase.milestones.length})
        </Typography>
        <List dense>
          {phase.milestones.map((milestone) => (
            <ListItem key={milestone.id} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                {getStatusIcon(milestone.status)}
              </ListItemIcon>
              <ListItemText 
                primary={milestone.name}
                secondary={milestone.date ? new Date(milestone.date).toLocaleDateString() : 'Pending'}
                primaryTypographyProps={{ variant: 'body2' }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </CardContent>
  </Card>
);

const TaskCard = ({ task }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            {task.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {task.description}
          </Typography>
        </Box>
        <Chip 
          label={task.priority.toUpperCase()} 
          color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'success'}
          size="small"
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Progress</Typography>
          <Typography variant="body2" color="primary.main" fontWeight="bold">
            {task.progress}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={task.progress} 
          sx={{ height: 6, borderRadius: 3 }}
        />
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Assigned to: {task.assignedTo}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

function ProjectDetail() {
  const { id } = useParams();
  const [project] = useState(mockProjectData);
  const [activeStep, setActiveStep] = useState(2); // Construction phase
  const [openTaskDialog, setOpenTaskDialog] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box>
      {/* Project Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {project.name}
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                {project.location}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Client: {project.client} | Contractor: {project.contractor}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Chip 
                label={project.status.toUpperCase()} 
                color={project.status === 'active' ? 'success' : 'default'}
                size="large"
              />
              <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                {project.progress}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Overall Progress
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" color="textSecondary">
                Start Date: {new Date(project.startDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                End Date: {new Date(project.endDate).toLocaleDateString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {project.budget}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Budget
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Construction Phases */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Construction Phases & Progress
              </Typography>
              
              {project.phases.map((phase, index) => (
                <PhaseCard 
                  key={phase.id} 
                  phase={phase} 
                  isActive={phase.status === 'active'}
                />
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Current Tasks & Quality Control */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Current Tasks
                </Typography>
                <IconButton size="small" onClick={() => setOpenTaskDialog(true)}>
                  <AddIcon />
                </IconButton>
              </Box>
              
              {project.currentTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Quality Checks
              </Typography>
              
              {project.qualityChecks.slice(0, 3).map((check) => (
                <Box key={check.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {check.type}
                    </Typography>
                    <Chip 
                      label={check.result} 
                      color={check.result === 'Passed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {check.description}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(check.date).toLocaleDateString()} • {check.engineer}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Overview
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                      {Math.round((project.financials.spent / project.financials.totalBudget) * 100)}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Budget Spent
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      PKR {Math.round(project.financials.remaining / 1000000)}M
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Remaining Budget
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      PKR {Math.round(project.financials.committed / 1000000)}M
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Committed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="h4" color="info.main" fontWeight="bold">
                      PKR {Math.round(project.financials.totalBudget / 1000000)}M
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Budget
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Task Dialog */}
      <Dialog open={openTaskDialog} onClose={() => setOpenTaskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Task Name"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Assigned To"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Due Date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Task</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProjectDetail;