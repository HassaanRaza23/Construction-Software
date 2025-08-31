import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,

  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  Schedule,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

import { useParams } from 'react-router-dom';
import { 
  getProject, 
  updateProject, 
  PROJECT_PHASES, 
  PRE_CONSTRUCTION_TASKS,
  CONSTRUCTION_TASKS,
  FINISHING_SUBTASKS,
  calculateProgress 
} from '../data/projectData';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const [floorData, setFloorData] = useState({ number: '', type: 'floor' });

  useEffect(() => {
    const projectData = getProject(id);
    setProject(projectData);
  }, [id]);

  if (!project) {
    return <Typography>Project not found</Typography>;
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case PROJECT_PHASES.PRE_CONSTRUCTION:
        return 'warning';
      case PROJECT_PHASES.CONSTRUCTION:
        return 'info';
      case PROJECT_PHASES.POST_CONSTRUCTION:
        return 'success';
      default:
        return 'default';
    }
  };

  const getPhaseLabel = (phase) => {
    switch (phase) {
      case PROJECT_PHASES.PRE_CONSTRUCTION:
        return 'Pre-Construction';
      case PROJECT_PHASES.CONSTRUCTION:
        return 'Construction';
      case PROJECT_PHASES.POST_CONSTRUCTION:
        return 'Post-Construction';
      default:
        return 'Unknown';
    }
  };

  const addFloor = () => {
    const newFloor = {
      number: floorData.number,
      type: floorData.type,
      greyStructureComplete: false,
      finishingComplete: false,
      greyStructureStartDate: null,
      greyStructureEndDate: null,
      finishingStartDate: null,
      finishingEndDate: null,
      cubeTests: [],
      engineerInspections: []
    };
    
    const updatedProject = {
      ...project,
      construction: {
        ...project.construction,
        floors: [...project.construction.floors, newFloor]
      }
    };
    
    setProject(updatedProject);
    updateProject(id, updatedProject);
    setOpenDialog(false);
    setFloorData({ number: '', type: 'floor' });
  };

  const toggleTaskCompletion = (floorIndex, taskType, taskId) => {
    const updatedFloors = [...project.construction.floors];
    if (taskType === 'grey') {
      updatedFloors[floorIndex].greyStructureComplete = !updatedFloors[floorIndex].greyStructureComplete;
    } else if (taskType === 'finishing') {
      updatedFloors[floorIndex].finishingComplete = !updatedFloors[floorIndex].finishingComplete;
    }
    
    const updatedProject = {
      ...project,
      construction: {
        ...project.construction,
        floors: updatedFloors
      }
    };
    
    setProject(updatedProject);
    updateProject(id, updatedProject);
  };

  const startConstruction = () => {
    const updatedProject = {
      ...project,
      currentPhase: PROJECT_PHASES.CONSTRUCTION,
      progress: {
        ...project.progress,
        preConstructionComplete: true,
        constructionStarted: true
      }
    };
    
    setProject(updatedProject);
    updateProject(id, updatedProject);
  };

  const renderPreConstructionTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Pre-Construction Tasks</Typography>
            <List>
              {PRE_CONSTRUCTION_TASKS.map((task, index) => (
                <ListItem key={task.id} divider={index < PRE_CONSTRUCTION_TASKS.length - 1}>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={task.name}
                    secondary={`Step ${task.order}`}
                  />
                </ListItem>
              ))}
            </List>
            
            {!project.progress.preConstructionComplete && (
              <Box mt={2}>
                <Button 
                  variant="contained" 
                  onClick={startConstruction}
                  fullWidth
                >
                  Mark Pre-Construction Complete & Start Construction
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Project Information</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Location:</strong> {project.location}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Client:</strong> {project.client}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Land Area:</strong> {project.preConstruction?.landDetails?.area || 'Not specified'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              <strong>Piling Required:</strong> {project.preConstruction?.soilTest?.pilingRequired ? 'Yes' : 'No'}
            </Typography>
            
            <Box mt={2}>
              <Chip 
                label={getPhaseLabel(project.currentPhase)} 
                color={getPhaseColor(project.currentPhase)}
              />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Stakeholders</Typography>
            {project.preConstruction?.stakeholders?.architect?.name && (
              <Typography variant="body2" gutterBottom>
                <strong>Architect:</strong> {project.preConstruction.stakeholders.architect.name}
              </Typography>
            )}
            {project.preConstruction?.stakeholders?.contractor?.name && (
              <Typography variant="body2" gutterBottom>
                <strong>Contractor:</strong> {project.preConstruction.stakeholders.contractor.name}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderConstructionTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Construction Progress</Typography>
          {project.progress.constructionStarted && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Add Floor
            </Button>
          )}
        </Box>
        
        {!project.progress.constructionStarted ? (
          <Alert severity="info">
            Complete pre-construction phase to start construction tracking.
          </Alert>
        ) : (
          <>
            {/* Foundation Work */}
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Foundation Work</Typography>
                <List>
                  {CONSTRUCTION_TASKS.filter(task => !task.isFloorBased).map((task) => (
                    <ListItem key={task.id}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.name}
                        secondary={task.hasTest ? 'Includes cube test and engineer inspection' : ''}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Floor-by-Floor Progress */}
            {project.construction.floors.map((floor, floorIndex) => (
              <Accordion key={floorIndex} defaultExpanded={floorIndex === 0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" width="100%">
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {floor.number} Floor
                    </Typography>
                    <Box display="flex" gap={1} mr={2}>
                      <Chip 
                        label={floor.greyStructureComplete ? 'Grey Complete' : 'Grey Pending'} 
                        color={floor.greyStructureComplete ? 'success' : 'default'}
                        size="small"
                      />
                      <Chip 
                        label={floor.finishingComplete ? 'Finishing Complete' : 'Finishing Pending'} 
                        color={floor.finishingComplete ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {/* Grey Structure */}
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                            Grey Structure
                          </Typography>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={floor.greyStructureComplete}
                                onChange={() => toggleTaskCompletion(floorIndex, 'grey')}
                              />
                            }
                            label="Complete"
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          Includes chhat barhai (roof completion) and cube tests
                        </Typography>
                      </Paper>
                    </Grid>

                    {/* Finishing Work */}
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                            Finishing Work
                          </Typography>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={floor.finishingComplete}
                                onChange={() => toggleTaskCompletion(floorIndex, 'finishing')}
                              />
                            }
                            label="Complete"
                          />
                        </Box>
                        <List dense>
                          {FINISHING_SUBTASKS.slice(0, 5).map((subtask) => (
                            <ListItem key={subtask.id} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <RadioButtonUnchecked fontSize="small" />
                              </ListItemIcon>
                              <ListItemText 
                                primary={subtask.name} 
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                          <ListItem sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary="+ 5 more tasks..." 
                              primaryTypographyProps={{ variant: 'body2', color: 'textSecondary' }}
                            />
                          </ListItem>
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
            
            {project.construction.floors.length === 0 && (
              <Alert severity="info">
                Add floors to start tracking construction progress.
              </Alert>
            )}
          </>
        )}
      </Grid>
    </Grid>
  );

  const renderQualityControlTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Cube Tests</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Tests performed after piling, rafting, plinth, and each floor's chhat barhai
            </Typography>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Stage</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Result</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Piling</TableCell>
                    <TableCell>2024-02-15</TableCell>
                    <TableCell>28 MPa</TableCell>
                    <TableCell><Chip label="Passed" color="success" size="small" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Raft</TableCell>
                    <TableCell>2024-02-28</TableCell>
                    <TableCell>30 MPa</TableCell>
                    <TableCell><Chip label="Passed" color="success" size="small" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Plinth</TableCell>
                    <TableCell>2024-03-10</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell><Chip label="Pending" color="warning" size="small" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
            <Button startIcon={<AddIcon />} sx={{ mt: 2 }}>
              Add Test Result
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Engineer Inspections</Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Regular engineer checks and approvals at each construction stage
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Foundation Inspection"
                  secondary="Eng. Kareem Ahmed - 2024-02-20"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Plinth Level Check"
                  secondary="Eng. Kareem Ahmed - 2024-03-05"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Schedule color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary="Ground Floor Structure"
                  secondary="Scheduled for 2024-03-20"
                />
              </ListItem>
            </List>
            
            <Button startIcon={<AddIcon />} sx={{ mt: 2 }}>
              Schedule Inspection
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderFinancialTab = () => {
    const financial = project.preConstruction?.financial || {};
    const contractor = project.preConstruction?.stakeholders?.contractor || {};
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Budget Overview</Typography>
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary">Total Budget</Typography>
                <Typography variant="h5">{financial.totalBudget || 'Not specified'}</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Land Amount</Typography>
                  <Typography variant="h6">{financial.landAmount || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Contract Amount</Typography>
                  <Typography variant="h6">{contractor.contractAmount || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Legal Fees</Typography>
                  <Typography variant="h6">{financial.legalFees || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Transfer Fees</Typography>
                  <Typography variant="h6">{financial.transferFees || 'Not specified'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Payment Tracking</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Track payments to contractors, suppliers, and other stakeholders
              </Typography>
              
              <Alert severity="info">
                Payment tracking module - Coming soon
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      {/* Project Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          {project.name}
        </Typography>
        <Box display="flex" gap={2} alignItems="center" mb={2}>
          <Chip 
            label={getPhaseLabel(project.currentPhase)} 
            color={getPhaseColor(project.currentPhase)}
          />
          <Typography color="textSecondary">
            {project.location} • {project.client}
          </Typography>
        </Box>
        
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Overall Progress</Typography>
            <Typography variant="body2">{calculateProgress(project)}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={calculateProgress(project)} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Box>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Pre-Construction" />
            <Tab label="Construction" />
            <Tab label="Quality Control" />
            <Tab label="Financial" />
          </Tabs>
        </Box>
        
        <CardContent>
          {activeTab === 0 && renderPreConstructionTab()}
          {activeTab === 1 && renderConstructionTab()}
          {activeTab === 2 && renderQualityControlTab()}
          {activeTab === 3 && renderFinancialTab()}
        </CardContent>
      </Card>

      {/* Add Floor Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Floor</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Floor Name/Number"
            placeholder="e.g., Ground, First, Second, Basement"
            value={floorData.number}
            onChange={(e) => setFloorData({ ...floorData, number: e.target.value })}
            sx={{ mt: 2 }}
          />
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Floor Type</FormLabel>
            <RadioGroup
              value={floorData.type}
              onChange={(e) => setFloorData({ ...floorData, type: e.target.value })}
            >
              <FormControlLabel value="basement" control={<Radio />} label="Basement" />
              <FormControlLabel value="ground" control={<Radio />} label="Ground Floor" />
              <FormControlLabel value="floor" control={<Radio />} label="Upper Floor" />
              <FormControlLabel value="rooftop" control={<Radio />} label="Rooftop" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={addFloor} variant="contained">Add Floor</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetails;