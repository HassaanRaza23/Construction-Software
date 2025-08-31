import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Engineering as EngineeringIcon,
  ExpandMore as ExpandMoreIcon,
  Update as UpdateIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
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
  currentPhase: 'Floor 3 Grey Structure',
  progress: 75,
  status: 'construction',
  
  // Construction Progress (what we actually track)
  constructionProgress: {
    foundation: {
      piling: { status: 'completed', date: '2024-04-01', notes: 'All piles completed', engineer: 'Ahmed Khan' },
      raft: { status: 'completed', date: '2024-04-20', notes: 'Raft foundation ready', engineer: 'Ahmed Khan' },
      plinth: { status: 'completed', date: '2024-05-10', notes: 'Plinth construction done', engineer: 'Ahmed Khan' },
      verification: { status: 'completed', date: '2024-05-15', notes: 'Engineer approved', engineer: 'Ahmed Khan' },
    },
    floors: [
      {
        floorNumber: 0,
        name: 'Ground Floor',
        greyStructure: { status: 'completed', date: '2024-06-15', notes: 'Structure ready', engineer: 'Ahmed Khan' },
        finishing: { status: 'completed', date: '2024-07-30', notes: 'All finishing done', engineer: 'Ahmed Khan' },
        chhatBarhai: { status: 'completed', date: '2024-06-20', notes: 'Roof completed', engineer: 'Ahmed Khan' },
      },
      {
        floorNumber: 1,
        name: '1st Floor',
        greyStructure: { status: 'completed', date: '2024-08-30', notes: 'Structure ready', engineer: 'Ahmed Khan' },
        finishing: { status: 'completed', date: '2024-10-15', notes: 'All finishing done', engineer: 'Ahmed Khan' },
        chhatBarhai: { status: 'completed', date: '2024-09-05', notes: 'Roof completed', engineer: 'Ahmed Khan' },
      },
      {
        floorNumber: 2,
        name: '2nd Floor',
        greyStructure: { status: 'completed', date: '2024-11-15', notes: 'Structure ready', engineer: 'Ahmed Khan' },
        finishing: { status: 'in_progress', date: '2024-12-10', notes: 'Tiling in progress', engineer: 'Ahmed Khan' },
        chhatBarhai: { status: 'completed', date: '2024-11-25', notes: 'Roof completed', engineer: 'Ahmed Khan' },
      },
      {
        floorNumber: 3,
        name: '3rd Floor',
        greyStructure: { status: 'in_progress', date: '2024-12-19', notes: 'Columns in progress', engineer: 'Ahmed Khan' },
        finishing: { status: 'not_started', date: null, notes: 'Waiting for structure', engineer: null },
        chhatBarhai: { status: 'not_started', date: null, notes: 'Waiting for structure', engineer: null },
      },
      {
        floorNumber: 4,
        name: '4th Floor',
        greyStructure: { status: 'not_started', date: null, notes: 'Not started yet', engineer: null },
        finishing: { status: 'not_started', date: null, notes: 'Not started yet', engineer: null },
        chhatBarhai: { status: 'not_started', date: null, notes: 'Not started yet', engineer: null },
      },
      {
        floorNumber: 5,
        name: '5th Floor',
        greyStructure: { status: 'not_started', date: null, notes: 'Not started yet', engineer: null },
        finishing: { status: 'not_started', date: null, notes: 'Not started yet', engineer: null },
        chhatBarhai: { status: 'not_started', date: null, notes: 'Not started yet', engineer: null },
      },
      {
        floorNumber: 6,
        name: '6th Floor',
        greyStructure: { status: 'not_started', date: null, notes: 'Not started yet', engineer: null },
        finishing: { status: 'not_started', date: null, notes: 'Not started yet', engineer: null },
        chhatBarhai: { status: 'not_started', date: null, notes: 'Not started yet', engineer: null },
      },
      {
        floorNumber: 7,
        name: '7th Floor',
        greyStructure: { status: 'not_started', date: null, notes: 'Not started yet', engineer: null },
        finishing: { status: 'not_started', date: null, notes: 'Not started yet', engineer: null },
        chhatBarhai: { status: 'not_started', date: null, notes: 'Not started yet', engineer: null },
      }
    ],
    elevation: {
      plastering: { status: 'not_started', date: null, notes: 'Will start after all floors', engineer: null },
      painting: { status: 'not_started', date: null, notes: 'Will start after plastering', engineer: null },
      finalInspection: { status: 'not_started', date: null, notes: 'Final quality check', engineer: null },
      handover: { status: 'not_started', date: null, notes: 'Project completion', engineer: null },
    }
  },
  
  // Quality Control Tracking
  qualityControl: {
    cubeTests: [
      { floor: 'Ground Floor', date: '2024-06-18', result: 'Passed', strength: '25 MPa', engineer: 'Ahmed Khan' },
      { floor: '1st Floor', date: '2024-08-25', result: 'Passed', strength: '26 MPa', engineer: 'Ahmed Khan' },
      { floor: '2nd Floor', date: '2024-11-18', result: 'Passed', strength: '24 MPa', engineer: 'Ahmed Khan' },
      { floor: '3rd Floor', date: '2024-12-18', result: 'Scheduled', strength: 'Pending', engineer: 'Ahmed Khan' },
    ],
    engineerInspections: [
      { floor: 'Ground Floor', date: '2024-07-25', engineer: 'Ahmed Khan', status: 'Approved', notes: 'All work approved' },
      { floor: '1st Floor', date: '2024-10-10', engineer: 'Ahmed Khan', status: 'Approved', notes: 'Quality standards met' },
      { floor: '2nd Floor', date: '2024-12-15', engineer: 'Ahmed Khan', status: 'Pending', notes: 'Scheduled for inspection' },
    ]
  },
  
  // Team Information
  team: {
    architect: 'Design Studio',
    engineer: 'Structural Solutions',
    contractor: 'XYZ Construction',
    supervisingStaff: 'Site Engineers Team',
  },
  
  // Financial Tracking
  financials: {
    totalBudget: 250000000,
    spent: 187500000,
    remaining: 62500000,
    breakdown: {
      foundation: 30000000,
      greyStructure: 75000000,
      finishing: 22500000,
      materials: 60000000,
    }
  },
  
  lastUpdated: '2024-12-19',
  nextMilestone: '3rd Floor Chhat Barhai',
  nextMilestoneDate: '2024-12-25',
};

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'primary';
    case 'not_started': return 'default';
    default: return 'default';
  }
};



const ConstructionPhaseCard = ({ title, phases, onUpdatePhase }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      
      {Object.entries(phases).map(([key, phase]) => (
        <Box key={key} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                label={phase.status.replace('_', ' ').toUpperCase()} 
                color={getStatusColor(phase.status)}
                size="small"
              />
              <IconButton 
                size="small" 
                onClick={() => onUpdatePhase(key, phase)}
                color="primary"
              >
                <UpdateIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {phase.notes}
          </Typography>
          
          {phase.date && (
            <Typography variant="caption" color="textSecondary">
              Date: {new Date(phase.date).toLocaleDateString()}
            </Typography>
          )}
          
          {phase.engineer && (
            <Typography variant="caption" color="textSecondary" display="block">
              Engineer: {phase.engineer}
            </Typography>
          )}
        </Box>
      ))}
    </CardContent>
  </Card>
);

const FloorProgressCard = ({ floor, onUpdateFloor }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        {floor.name}
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                Grey Structure
              </Typography>
              <Chip 
                label={floor.greyStructure.status.replace('_', ' ').toUpperCase()} 
                color={getStatusColor(floor.greyStructure.status)}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {floor.greyStructure.notes}
            </Typography>
            {floor.greyStructure.date && (
              <Typography variant="caption" color="textSecondary">
                Date: {new Date(floor.greyStructure.date).toLocaleDateString()}
              </Typography>
            )}
            <Button
              size="small"
              startIcon={<UpdateIcon />}
              onClick={() => onUpdateFloor(floor.floorNumber, 'greyStructure')}
              sx={{ mt: 1 }}
            >
              Update
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                Finishing
              </Typography>
              <Chip 
                label={floor.finishing.status.replace('_', ' ').toUpperCase()} 
                color={getStatusColor(floor.finishing.status)}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {floor.finishing.notes}
            </Typography>
            {floor.finishing.date && (
              <Typography variant="caption" color="textSecondary">
                Date: {new Date(floor.finishing.date).toLocaleDateString()}
              </Typography>
            )}
            <Button
              size="small"
              startIcon={<UpdateIcon />}
              onClick={() => onUpdateFloor(floor.floorNumber, 'finishing')}
              sx={{ mt: 1 }}
            >
              Update
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                Chhat Barhai
              </Typography>
              <Chip 
                label={floor.chhatBarhai.status.replace('_', ' ').toUpperCase()} 
                color={getStatusColor(floor.chhatBarhai.status)}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {floor.chhatBarhai.notes}
            </Typography>
            {floor.chhatBarhai.date && (
              <Typography variant="caption" color="textSecondary">
                Date: {new Date(floor.chhatBarhai.date).toLocaleDateString()}
              </Typography>
            )}
            <Button
              size="small"
              startIcon={<UpdateIcon />}
              onClick={() => onUpdateFloor(floor.floorNumber, 'chhatBarhai')}
              sx={{ mt: 1 }}
            >
              Update
            </Button>
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const QualityControlCard = ({ qualityControl }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
        Quality Control
      </Typography>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Cube Tests</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {qualityControl.cubeTests.map((test, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {test.floor}
                </Typography>
                <Chip 
                  label={test.result} 
                  color={test.result === 'Passed' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                Strength: {test.strength} | Date: {new Date(test.date).toLocaleDateString()}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Engineer: {test.engineer}
              </Typography>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Engineer Inspections</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {qualityControl.engineerInspections.map((inspection, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" fontWeight="bold">
                  {inspection.floor}
                </Typography>
                <Chip 
                  label={inspection.status} 
                  color={inspection.status === 'Approved' ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                Date: {new Date(inspection.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Engineer: {inspection.engineer}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Notes: {inspection.notes}
              </Typography>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>
    </CardContent>
  </Card>
);

// Update Progress Dialog
const UpdateProgressDialog = ({ open, onClose, onSave, phaseData, phaseType, floorNumber }) => {
  const [formData, setFormData] = useState({
    status: phaseData?.status || 'not_started',
    date: phaseData?.date || new Date().toISOString().split('T')[0],
    notes: phaseData?.notes || '',
    engineer: phaseData?.engineer || 'Ahmed Khan',
  });

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  const getPhaseTitle = () => {
    if (floorNumber !== undefined && phaseType) {
      const floorNames = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor', '6th Floor', '7th Floor'];
      return `${floorNames[floorNumber]} - ${phaseType.replace(/([A-Z])/g, ' $1').trim()}`;
    }
    if (phaseType) {
      return phaseType.replace(/([A-Z])/g, ' $1').trim();
    }
    return 'Update Progress';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Update Progress: {getPhaseTitle()}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="not_started">Not Started</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            type="date"
            label="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Engineer"
            value={formData.engineer}
            onChange={(e) => setFormData({ ...formData, engineer: e.target.value })}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Update Progress
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function ProjectDetail() {
  const [project, setProject] = useState(mockProjectData);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState({});

  const handleUpdatePhase = (phaseKey, phaseData) => {
    setUpdateData({ type: 'phase', key: phaseKey, phaseType: phaseKey, data: phaseData });
    setOpenUpdateDialog(true);
  };

  const handleUpdateFloor = (floorNumber, phaseType) => {
    const floor = project.constructionProgress.floors[floorNumber];
    setUpdateData({ type: 'floor', floorNumber, phaseType, data: floor[phaseType] });
    setOpenUpdateDialog(true);
  };

  const handleSaveUpdate = (formData) => {
    if (updateData.type === 'phase') {
      setProject(prev => ({
        ...prev,
        constructionProgress: {
          ...prev.constructionProgress,
          [updateData.key]: { ...prev.constructionProgress[updateData.key], ...formData }
        }
      }));
    } else if (updateData.type === 'floor') {
      setProject(prev => ({
        ...prev,
        constructionProgress: {
          ...prev.constructionProgress,
          floors: prev.constructionProgress.floors.map((floor, index) => 
            index === updateData.floorNumber 
              ? { ...floor, [updateData.phaseType]: { ...floor[updateData.phaseType], ...formData } }
              : floor
          )
        }
      }));
    }
  };

  // Calculate overall progress
  const calculateProgress = () => {
    const totalPhases = 3 + project.constructionProgress.floors.length * 3 + 4; // foundation + floors + elevation
    let completedPhases = 0;
    
    // Foundation phases
    Object.values(project.constructionProgress.foundation).forEach(phase => {
      if (phase.status === 'completed') completedPhases++;
    });
    
    // Floor phases
    project.constructionProgress.floors.forEach(floor => {
      if (floor.greyStructure.status === 'completed') completedPhases++;
      if (floor.finishing.status === 'completed') completedPhases++;
      if (floor.chhatBarhai.status === 'completed') completedPhases++;
    });
    
    // Elevation phases
    Object.values(project.constructionProgress.elevation).forEach(phase => {
      if (phase.status === 'completed') completedPhases++;
    });
    
    return Math.round((completedPhases / totalPhases) * 100);
  };

  const progress = calculateProgress();

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
                Client: {project.client} | Contractor: {project.team.contractor}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Chip 
                label={project.status.toUpperCase()} 
                color={project.status === 'construction' ? 'primary' : 'success'}
                size="large"
              />
              <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                {progress}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Construction Progress
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
        {/* Construction Progress */}
        <Grid item xs={12} lg={8}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Construction Progress Tracking
          </Typography>
          
          {/* Foundation Progress */}
          <ConstructionPhaseCard
            title="Foundation Work"
            phases={project.constructionProgress.foundation}
            onUpdatePhase={handleUpdatePhase}
          />
          
          {/* Floor Progress */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Floor-by-Floor Progress
          </Typography>
          {project.constructionProgress.floors.map((floor) => (
            <FloorProgressCard
              key={floor.floorNumber}
              floor={floor}
              onUpdateFloor={handleUpdateFloor}
            />
          ))}
          
          {/* Elevation Progress */}
          <ConstructionPhaseCard
            title="Elevation & Final Work"
            phases={project.constructionProgress.elevation}
            onUpdatePhase={handleUpdatePhase}
          />
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Quality Control */}
          <QualityControlCard qualityControl={project.qualityControl} />
          
          {/* Team Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Team
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Architect" 
                    secondary={project.team.architect}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EngineeringIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Engineer" 
                    secondary={project.team.engineer}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Contractor" 
                    secondary={project.team.contractor}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Supervising Staff" 
                    secondary={project.team.supervisingStaff}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Overview
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="textSecondary">Budget Spent</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {Math.round((project.financials.spent / project.financials.totalBudget) * 100)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(project.financials.spent / project.financials.totalBudget) * 100} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Budget Breakdown
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Foundation</Typography>
                  <Typography variant="caption">PKR {Math.round(project.financials.breakdown.foundation / 1000000)}M</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Grey Structure</Typography>
                  <Typography variant="caption">PKR {Math.round(project.financials.breakdown.greyStructure / 1000000)}M</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Finishing</Typography>
                  <Typography variant="caption">PKR {Math.round(project.financials.breakdown.finishing / 1000000)}M</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">Materials</Typography>
                  <Typography variant="caption">PKR {Math.round(project.financials.breakdown.materials / 1000000)}M</Typography>
                </Box>
              </Box>
              
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  PKR {Math.round(project.financials.remaining / 1000000)}M
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Remaining Budget
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Update Progress Dialog */}
      <UpdateProgressDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        onSave={handleSaveUpdate}
        phaseData={updateData.data}
        phaseType={updateData.phaseType}
        floorNumber={updateData.floorNumber}
      />
    </Box>
  );
}

export default ProjectDetail;