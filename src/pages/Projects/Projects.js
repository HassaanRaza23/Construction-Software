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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Construction as ConstructionIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data representing construction projects with actual progress tracking
const mockProjects = [
  {
    id: 1,
    name: 'Alpha Residency',
    location: 'DHA Phase 6, Karachi',
    client: 'ABC Developers',
    startDate: '2024-01-15',
    endDate: '2025-06-30',
    budget: 'PKR 250,000,000',
    status: 'construction', // construction, completed, on_hold
    currentPhase: 'Floor 3 Grey Structure',
    progress: 75,
    
    // Construction Progress (what we actually track)
    constructionProgress: {
      foundation: {
        piling: { status: 'completed', date: '2024-04-01', notes: 'All piles completed' },
        raft: { status: 'completed', date: '2024-04-20', notes: 'Raft foundation ready' },
        plinth: { status: 'completed', date: '2024-05-10', notes: 'Plinth construction done' },
        verification: { status: 'completed', date: '2024-05-15', notes: 'Engineer approved' },
      },
      floors: [
        {
          floorNumber: 0,
          name: 'Ground Floor',
          greyStructure: { status: 'completed', date: '2024-06-15', notes: 'Structure ready' },
          finishing: { status: 'completed', date: '2024-07-30', notes: 'All finishing done' },
          chhatBarhai: { status: 'completed', date: '2024-06-20', notes: 'Roof completed' },
        },
        {
          floorNumber: 1,
          name: '1st Floor',
          greyStructure: { status: 'completed', date: '2024-08-30', notes: 'Structure ready' },
          finishing: { status: 'completed', date: '2024-10-15', notes: 'All finishing done' },
          chhatBarhai: { status: 'completed', date: '2024-09-05', notes: 'Roof completed' },
        },
        {
          floorNumber: 2,
          name: '2nd Floor',
          greyStructure: { status: 'completed', date: '2024-11-15', notes: 'Structure ready' },
          finishing: { status: 'in_progress', date: '2024-12-10', notes: 'Tiling in progress' },
          chhatBarhai: { status: 'completed', date: '2024-11-25', notes: 'Roof completed' },
        },
        {
          floorNumber: 3,
          name: '3rd Floor',
          greyStructure: { status: 'in_progress', date: '2024-12-19', notes: 'Columns in progress' },
          finishing: { status: 'not_started', date: null, notes: 'Waiting for structure' },
          chhatBarhai: { status: 'not_started', date: null, notes: 'Waiting for structure' },
        },
        {
          floorNumber: 4,
          name: '4th Floor',
          greyStructure: { status: 'not_started', date: null, notes: 'Not started yet' },
          finishing: { status: 'not_started', date: null, notes: 'Not started yet' },
          chhatBarhai: { status: 'not_started', date: null, notes: 'Not started yet' },
        },
        {
          floorNumber: 5,
          name: '5th Floor',
          greyStructure: { status: 'not_started', date: null, notes: 'Not started yet' },
          finishing: { status: 'not_started', date: null, notes: 'Not started yet' },
          chhatBarhai: { status: 'not_started', date: null, notes: 'Not started yet' },
        },
        {
          floorNumber: 6,
          name: '6th Floor',
          greyStructure: { status: 'not_started', date: null, notes: 'Not started yet' },
          finishing: { status: 'not_started', date: null, notes: 'Not started yet' },
          chhatBarhai: { status: 'not_started', date: null, notes: 'Not started yet' },
        },
        {
          floorNumber: 7,
          name: '7th Floor',
          greyStructure: { status: 'not_started', date: null, notes: 'Not started yet' },
          finishing: { status: 'not_started', date: null, notes: 'Not started yet' },
          chhatBarhai: { status: 'not_started', date: null, notes: 'Not started yet' },
        }
      ],
      elevation: {
        plastering: { status: 'not_started', date: null, notes: 'Will start after all floors' },
        painting: { status: 'not_started', date: null, notes: 'Will start after plastering' },
        finalInspection: { status: 'not_started', date: null, notes: 'Final quality check' },
        handover: { status: 'not_started', date: null, notes: 'Project completion' },
      }
    },
    
    // Quality Control Tracking
    qualityControl: {
      cubeTests: [
        { floor: 'Ground Floor', date: '2024-06-18', result: 'Passed', strength: '25 MPa' },
        { floor: '1st Floor', date: '2024-08-25', result: 'Passed', strength: '26 MPa' },
        { floor: '2nd Floor', date: '2024-11-18', result: 'Passed', strength: '24 MPa' },
        { floor: '3rd Floor', date: '2024-12-18', result: 'Scheduled', strength: 'Pending' },
      ],
      engineerInspections: [
        { floor: 'Ground Floor', date: '2024-07-25', engineer: 'Ahmed Khan', status: 'Approved' },
        { floor: '1st Floor', date: '2024-10-10', engineer: 'Ahmed Khan', status: 'Approved' },
        { floor: '2nd Floor', date: '2024-12-15', engineer: 'Ahmed Khan', status: 'Pending' },
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
  },
  {
    id: 2,
    name: 'Beta Heights',
    location: 'Clifton, Karachi',
    client: 'Beta Properties',
    startDate: '2024-03-01',
    endDate: '2025-12-31',
    budget: 'PKR 450,000,000',
    status: 'construction',
    currentPhase: 'Floor 2 Finishing',
    progress: 45,
    
    constructionProgress: {
      foundation: {
        piling: { status: 'completed', date: '2024-04-15', notes: 'All piles completed' },
        raft: { status: 'completed', date: '2024-05-01', notes: 'Raft foundation ready' },
        plinth: { status: 'completed', date: '2024-05-20', notes: 'Plinth construction done' },
        verification: { status: 'completed', date: '2024-05-25', notes: 'Engineer approved' },
      },
      floors: [
        {
          floorNumber: 0,
          name: 'Ground Floor',
          greyStructure: { status: 'completed', date: '2024-07-01', notes: 'Structure ready' },
          finishing: { status: 'completed', date: '2024-08-15', notes: 'All finishing done' },
          chhatBarhai: { status: 'completed', date: '2024-07-10', notes: 'Roof completed' },
        },
        {
          floorNumber: 1,
          name: '1st Floor',
          greyStructure: { status: 'completed', date: '2024-09-01', notes: 'Structure ready' },
          finishing: { status: 'completed', date: '2024-10-30', notes: 'All finishing done' },
          chhatBarhai: { status: 'completed', date: '2024-09-10', notes: 'Roof completed' },
        },
        {
          floorNumber: 2,
          name: '2nd Floor',
          greyStructure: { status: 'completed', date: '2024-11-01', notes: 'Structure ready' },
          finishing: { status: 'in_progress', date: '2024-12-18', notes: 'Tiling and painting' },
          chhatBarhai: { status: 'completed', date: '2024-11-10', notes: 'Roof completed' },
        },
        {
          floorNumber: 3,
          name: '3rd Floor',
          greyStructure: { status: 'not_started', date: null, notes: 'Not started yet' },
          finishing: { status: 'not_started', date: null, notes: 'Not started yet' },
          chhatBarhai: { status: 'not_started', date: null, notes: 'Not started yet' },
        }
      ],
      elevation: {
        plastering: { status: 'not_started', date: null, notes: 'Will start after all floors' },
        painting: { status: 'not_started', date: null, notes: 'Will start after plastering' },
        finalInspection: { status: 'not_started', date: null, notes: 'Final quality check' },
        handover: { status: 'not_started', date: null, notes: 'Project completion' },
      }
    },
    
    qualityControl: {
      cubeTests: [
        { floor: 'Ground Floor', date: '2024-07-05', result: 'Passed', strength: '25 MPa' },
        { floor: '1st Floor', date: '2024-09-05', result: 'Passed', strength: '26 MPa' },
        { floor: '2nd Floor', date: '2024-11-05', result: 'Passed', strength: '24 MPa' },
      ],
      engineerInspections: [
        { floor: 'Ground Floor', date: '2024-08-10', engineer: 'Sara Ahmed', status: 'Approved' },
        { floor: '1st Floor', date: '2024-10-25', engineer: 'Sara Ahmed', status: 'Approved' },
        { floor: '2nd Floor', date: '2024-12-20', engineer: 'Sara Ahmed', status: 'Scheduled' },
      ]
    },
    
    team: {
      architect: 'Urban Architects',
      engineer: 'Civil Engineering Co.',
      contractor: 'Modern Builders',
      supervisingStaff: 'Quality Control Team',
    },
    
    financials: {
      totalBudget: 450000000,
      spent: 202500000,
      remaining: 247500000,
      breakdown: {
        foundation: 45000000,
        greyStructure: 90000000,
        finishing: 45000000,
        materials: 22500000,
      }
    },
    
    lastUpdated: '2024-12-18',
    nextMilestone: '2nd Floor Completion',
    nextMilestoneDate: '2024-12-30',
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'primary';
    case 'not_started': return 'default';
    case 'construction': return 'primary';
    case 'on_hold': return 'warning';
    default: return 'default';
  }
};



const ProjectCard = ({ project, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/projects/${project.id}`);
  };

  // Calculate overall progress based on construction phases
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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {project.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="textSecondary">
                {project.location}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={project.status.toUpperCase()} 
            color={getStatusColor(project.status)}
            size="small"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Current Phase: {project.currentPhase}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">Construction Progress</Typography>
            <Typography variant="body2" color="primary.main" fontWeight="bold">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="textSecondary">Client:</Typography>
            <Typography variant="body2">{project.client}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="textSecondary">Budget:</Typography>
            <Typography variant="body2" fontWeight="bold">{project.budget}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="textSecondary">Next Milestone:</Typography>
            <Typography variant="body2">{project.nextMilestone}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View Construction Progress">
              <IconButton size="small" onClick={handleView} color="primary">
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Project">
              <IconButton size="small" onClick={() => onEdit(project)} color="info">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Project">
              <IconButton size="small" onClick={() => onDelete(project.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="caption" color="textSecondary">
            Updated: {new Date(project.lastUpdated).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Project Setup Wizard Component
const ProjectSetupWizard = ({ open, onClose, onSave }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [projectData, setProjectData] = useState({
    basicInfo: {
      name: '',
      location: '',
      client: '',
      budget: '',
      startDate: '',
      endDate: '',
      totalFloors: 1,
    },
    preConstruction: {
      landSurvey: { uploaded: false, file: null, notes: '' },
      soilTest: { uploaded: false, file: null, notes: '' },
      architecturalPlan: { uploaded: false, file: null, notes: '' },
      saleNoc: { uploaded: false, file: null, notes: '' },
      legalFees: { paid: false, amount: '', notes: '' },
    },
    team: {
      architect: '',
      engineer: '',
      contractor: '',
      supervisingStaff: '',
    },
    materials: {
      boqCreated: false,
      materialList: { uploaded: false, file: null, notes: '' },
      procurementPlan: { uploaded: false, file: null, notes: '' },
    }
  });

  const steps = [
    'Basic Project Information',
    'Pre-Construction Requirements',
    'Team Assignment',
    'Material Requirements',
    'Project Ready'
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSave = () => {
    onSave(projectData);
    onClose();
  };

  const renderBasicInfo = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Project Name"
          value={projectData.basicInfo.name}
          onChange={(e) => setProjectData({
            ...projectData,
            basicInfo: { ...projectData.basicInfo, name: e.target.value }
          })}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Location"
          value={projectData.basicInfo.location}
          onChange={(e) => setProjectData({
            ...projectData,
            basicInfo: { ...projectData.basicInfo, location: e.target.value }
          })}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Client"
          value={projectData.basicInfo.client}
          onChange={(e) => setProjectData({
            ...projectData,
            basicInfo: { ...projectData.basicInfo, client: e.target.value }
          })}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Budget"
          value={projectData.basicInfo.budget}
          onChange={(e) => setProjectData({
            ...projectData,
            basicInfo: { ...projectData.basicInfo, budget: e.target.value }
          })}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="date"
          label="Start Date"
          value={projectData.basicInfo.startDate}
          onChange={(e) => setProjectData({
            ...projectData,
            basicInfo: { ...projectData.basicInfo, startDate: e.target.value }
          })}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          type="date"
          label="End Date"
          value={projectData.basicInfo.endDate}
          onChange={(e) => setProjectData({
            ...projectData,
            basicInfo: { ...projectData.basicInfo, endDate: e.target.value }
          })}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Total Floors"
          type="number"
          value={projectData.basicInfo.totalFloors}
          onChange={(e) => setProjectData({
            ...projectData,
            basicInfo: { ...projectData.basicInfo, totalFloors: parseInt(e.target.value) }
          })}
          required
        />
      </Grid>
    </Grid>
  );

  const renderPreConstruction = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Pre-Construction Requirements Checklist
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Complete all requirements before starting construction
      </Typography>
      
      <List>
        <ListItem>
          <ListItemIcon>
            <Checkbox
              checked={projectData.preConstruction.landSurvey.uploaded}
              onChange={(e) => setProjectData({
                ...projectData,
                preConstruction: {
                  ...projectData.preConstruction,
                  landSurvey: { ...projectData.preConstruction.landSurvey, uploaded: e.target.checked }
                }
              })}
            />
          </ListItemIcon>
          <ListItemText 
            primary="Land Survey" 
            secondary="Site plan with actual dimensions"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <Checkbox
              checked={projectData.preConstruction.soilTest.uploaded}
              onChange={(e) => setProjectData({
                ...projectData,
                preConstruction: {
                  ...projectData.preConstruction,
                  soilTest: { ...projectData.preConstruction.soilTest, uploaded: e.target.checked }
                }
              })}
            />
          </ListItemIcon>
          <ListItemText 
            primary="Soil Test Results" 
            secondary="Determine if piling is needed"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <Checkbox
              checked={projectData.preConstruction.architecturalPlan.uploaded}
              onChange={(e) => setProjectData({
                ...projectData,
                preConstruction: {
                  ...projectData.preConstruction,
                  architecturalPlan: { ...projectData.preConstruction.architecturalPlan, uploaded: e.target.checked }
                }
              })}
            />
          </ListItemIcon>
          <ListItemText 
            primary="Architectural Plans" 
            secondary="Approved building plans"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <Checkbox
              checked={projectData.preConstruction.saleNoc.uploaded}
              onChange={(e) => setProjectData({
                ...projectData,
                preConstruction: {
                  ...projectData.preConstruction,
                  saleNoc: { ...projectData.preConstruction.saleNoc, uploaded: e.target.checked }
                }
              })}
            />
          </ListItemIcon>
          <ListItemText 
            primary="Sale NOC" 
            secondary="No Objection Certificate received"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <Checkbox
              checked={projectData.preConstruction.legalFees.paid}
              onChange={(e) => setProjectData({
                ...projectData,
                preConstruction: {
                  ...projectData.preConstruction,
                  legalFees: { ...projectData.preConstruction.legalFees, paid: e.target.checked }
                }
              })}
            />
          </ListItemIcon>
          <ListItemText 
            primary="Legal Fees Paid" 
            secondary="All legal and transfer fees completed"
          />
        </ListItem>
      </List>
    </Box>
  );

  const renderTeam = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Architect"
          value={projectData.team.architect}
          onChange={(e) => setProjectData({
            ...projectData,
            team: { ...projectData.team, architect: e.target.value }
          })}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Engineer"
          value={projectData.team.engineer}
          onChange={(e) => setProjectData({
            ...projectData,
            team: { ...projectData.team, engineer: e.target.value }
          })}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Contractor"
          value={projectData.team.contractor}
          onChange={(e) => setProjectData({
            ...projectData,
            team: { ...projectData.team, contractor: e.target.value }
          })}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Supervising Staff"
          value={projectData.team.supervisingStaff}
          onChange={(e) => setProjectData({
            ...projectData,
            team: { ...projectData.team, supervisingStaff: e.target.value }
          })}
          required
        />
      </Grid>
    </Grid>
  );

  const renderMaterials = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Material Requirements
      </Typography>
      
      <List>
        <ListItem>
          <ListItemIcon>
            <Checkbox
              checked={projectData.materials.boqCreated}
              onChange={(e) => setProjectData({
                ...projectData,
                materials: { ...projectData.materials, boqCreated: e.target.checked }
              })}
            />
          </ListItemIcon>
          <ListItemText 
            primary="BOQ Created" 
            secondary="Bill of Quantities prepared"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <Checkbox
              checked={projectData.materials.materialList.uploaded}
              onChange={(e) => setProjectData({
                ...projectData,
                materials: {
                  ...projectData.materials,
                  materialList: { ...projectData.materials.materialList, uploaded: e.target.checked }
                }
              })}
            />
          </ListItemIcon>
          <ListItemText 
            primary="Material List" 
            secondary="Engineer's material requirements"
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <Checkbox
              checked={projectData.materials.procurementPlan.uploaded}
              onChange={(e) => setProjectData({
                ...projectData,
                materials: {
                  ...projectData.materials,
                  procurementPlan: { ...projectData.materials.procurementPlan, uploaded: e.target.checked }
                }
              })}
            />
          </ListItemIcon>
          <ListItemText 
            primary="Procurement Plan" 
            secondary="Material procurement strategy"
          />
        </ListItem>
      </List>
    </Box>
  );

  const renderProjectReady = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Project Ready to Start!
      </Typography>
      <Typography variant="body1" color="textSecondary">
        All pre-construction requirements have been completed. 
        The project is ready to begin construction work.
      </Typography>
    </Box>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0: return renderBasicInfo();
      case 1: return renderPreConstruction();
      case 2: return renderTeam();
      case 3: return renderMaterials();
      case 4: return renderProjectReady();
      default: return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        New Project Setup
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 2 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Box sx={{ mb: 2 }}>
                  {renderStepContent(index)}
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    onClick={index === steps.length - 1 ? handleSave : handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Create Project' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};

function Projects() {
  const [projects, setProjects] = useState(mockProjects);
  const [editingProject, setEditingProject] = useState(null);
  const [openSetupWizard, setOpenSetupWizard] = useState(false);

  const handleAddProject = () => {
    setOpenSetupWizard(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const handleSaveProject = (projectData) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...projectData } : p));
    } else {
      const newProject = {
        ...projectData,
        id: Date.now(),
        status: 'construction',
        lastUpdated: new Date().toISOString(),
      };
      setProjects([...projects, newProject]);
    }
  };

  const handleSetupWizardComplete = (projectData) => {
    // Create new project with construction progress structure
    const newProject = {
      id: Date.now(),
      ...projectData.basicInfo,
      location: projectData.basicInfo.location,
      client: projectData.basicInfo.client,
      budget: projectData.basicInfo.budget,
      startDate: projectData.basicInfo.startDate,
      endDate: projectData.basicInfo.endDate,
      status: 'construction',
      currentPhase: 'Foundation - Piling',
      progress: 0,
      team: projectData.team,
      constructionProgress: {
        foundation: {
          piling: { status: 'not_started', date: null, notes: 'Ready to start' },
          raft: { status: 'not_started', date: null, notes: 'Waiting for piling' },
          plinth: { status: 'not_started', date: null, notes: 'Waiting for raft' },
          verification: { status: 'not_started', date: null, notes: 'Waiting for plinth' },
        },
        floors: Array.from({ length: projectData.basicInfo.totalFloors }, (_, i) => ({
          floorNumber: i,
          name: `${i === 0 ? 'Ground' : `${i}${getOrdinalSuffix(i)}`} Floor`,
          greyStructure: { status: 'not_started', date: null, notes: 'Waiting for foundation' },
          finishing: { status: 'not_started', date: null, notes: 'Waiting for grey structure' },
          chhatBarhai: { status: 'not_started', date: null, notes: 'Waiting for grey structure' },
        })),
        elevation: {
          plastering: { status: 'not_started', date: null, notes: 'Will start after all floors' },
          painting: { status: 'not_started', date: null, notes: 'Will start after plastering' },
          finalInspection: { status: 'not_started', date: null, notes: 'Final quality check' },
          handover: { status: 'not_started', date: null, notes: 'Project completion' },
        }
      },
      qualityControl: {
        cubeTests: [],
        engineerInspections: []
      },
      financials: {
        totalBudget: parseInt(projectData.basicInfo.budget.replace(/\D/g, '')),
        spent: 0,
        remaining: parseInt(projectData.basicInfo.budget.replace(/\D/g, '')),
        breakdown: {
          foundation: 0,
          greyStructure: 0,
          finishing: 0,
          materials: 0,
        }
      },
      lastUpdated: new Date().toISOString(),
      nextMilestone: 'Foundation - Piling',
      nextMilestoneDate: null,
    };
    
    setProjects([...projects, newProject]);
    setOpenSetupWizard(false);
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Construction Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProject}
        >
          Create New Project
        </Button>
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} lg={4} key={project.id}>
            <ProjectCard
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onView={() => {}}
            />
          </Grid>
        ))}
      </Grid>

      {/* Project Setup Wizard */}
      <ProjectSetupWizard
        open={openSetupWizard}
        onClose={() => setOpenSetupWizard(false)}
        onSave={handleSetupWizardComplete}
      />
    </Box>
  );
}

export default Projects;