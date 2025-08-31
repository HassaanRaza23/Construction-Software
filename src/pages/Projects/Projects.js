import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
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
  Add as AddIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data representing Pakistani construction projects
const mockProjects = [
  {
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
  },
  {
    id: 2,
    name: 'Beta Heights',
    location: 'Clifton, Karachi',
    client: 'Beta Properties',
    startDate: '2024-03-01',
    endDate: '2025-12-31',
    budget: 'PKR 450,000,000',
    currentPhase: 'Finishing Work - Floor 2',
    progress: 45,
    status: 'active',
    phase: 'construction',
    subPhase: 'finishing',
    floor: 2,
    totalFloors: 12,
    contractor: 'Modern Builders',
    architect: 'Urban Architects',
    engineer: 'Civil Engineering Co.',
    lastUpdated: '2024-12-18',
    nextMilestone: 'Floor 2 Completion',
    nextMilestoneDate: '2024-12-30',
  },
  {
    id: 3,
    name: 'Gamma Plaza',
    location: 'Gulshan-e-Iqbal, Karachi',
    client: 'Gamma Group',
    startDate: '2023-11-01',
    endDate: '2025-03-31',
    budget: 'PKR 180,000,000',
    currentPhase: 'Foundation - Piling Complete',
    progress: 90,
    status: 'active',
    phase: 'construction',
    subPhase: 'foundation',
    floor: 0,
    totalFloors: 6,
    contractor: 'Foundation Experts',
    architect: 'Plaza Design',
    engineer: 'Foundation Engineers',
    lastUpdated: '2024-12-19',
    nextMilestone: 'Raft Foundation',
    nextMilestoneDate: '2024-12-22',
  },
  {
    id: 4,
    name: 'Delta Complex',
    location: 'North Nazimabad, Karachi',
    client: 'Delta Holdings',
    startDate: '2024-06-01',
    endDate: '2026-01-31',
    budget: 'PKR 320,000,000',
    currentPhase: 'Planning & Approvals',
    progress: 30,
    status: 'active',
    phase: 'planning',
    subPhase: 'approvals',
    floor: 0,
    totalFloors: 10,
    contractor: 'TBD',
    architect: 'Complex Architects',
    engineer: 'TBD',
    lastUpdated: '2024-12-15',
    nextMilestone: 'Sale NOC Approval',
    nextMilestoneDate: '2025-01-15',
  },
  {
    id: 5,
    name: 'Epsilon Tower',
    location: 'Karachi Harbour',
    client: 'Epsilon Corp',
    startDate: '2023-05-01',
    endDate: '2024-11-30',
    budget: 'PKR 280,000,000',
    currentPhase: 'Completed',
    progress: 100,
    status: 'completed',
    phase: 'completed',
    subPhase: 'handover',
    floor: 8,
    totalFloors: 8,
    contractor: 'Harbour Builders',
    architect: 'Tower Design',
    engineer: 'Harbour Engineering',
    lastUpdated: '2024-11-30',
    nextMilestone: 'Handover Complete',
    nextMilestoneDate: '2024-11-30',
  },
];

// Construction phases based on Pakistani workflow
const constructionPhases = {
  planning: {
    name: 'Planning & Feasibility',
    color: 'info',
    subPhases: ['land_survey', 'soil_testing', 'architectural_plan', 'approvals', 'sale_noc'],
  },
  foundation: {
    name: 'Foundation Work',
    color: 'warning',
    subPhases: ['piling', 'raft', 'plinth', 'plinth_verification'],
  },
  construction: {
    name: 'Construction',
    color: 'primary',
    subPhases: ['grey_structure', 'finishing', 'elevation'],
  },
  completed: {
    name: 'Completed',
    color: 'success',
    subPhases: ['final_inspection', 'handover'],
  },
};

const getPhaseColor = (phase) => {
  return constructionPhases[phase]?.color || 'default';
};

const getPhaseName = (phase) => {
  return constructionPhases[phase]?.name || phase;
};

const ProjectCard = ({ project, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/projects/${project.id}`);
  };

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
            label={getPhaseName(project.phase)} 
            color={getPhaseColor(project.phase)}
            size="small"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Current Phase: {project.currentPhase}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">Progress</Typography>
            <Typography variant="body2" color="primary.main" fontWeight="bold">
              {project.progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={project.progress} 
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
            <Tooltip title="View Details">
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

function Projects() {
  const [projects, setProjects] = useState(mockProjects);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filterPhase, setFilterPhase] = useState('all');

  const handleAddProject = () => {
    setEditingProject(null);
    setOpenDialog(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setOpenDialog(true);
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
        progress: 0,
        status: 'active',
        lastUpdated: new Date().toISOString(),
      };
      setProjects([...projects, newProject]);
    }
    setOpenDialog(false);
  };

  const filteredProjects = filterPhase === 'all' 
    ? projects 
    : projects.filter(p => p.phase === filterPhase);

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
          Add New Project
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Phase</InputLabel>
          <Select
            value={filterPhase}
            label="Filter by Phase"
            onChange={(e) => setFilterPhase(e.target.value)}
          >
            <MenuItem value="all">All Phases</MenuItem>
            {Object.entries(constructionPhases).map(([key, phase]) => (
              <MenuItem key={key} value={key}>{phase.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
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

      {/* Add/Edit Project Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <DialogContent>
          <ProjectForm 
            project={editingProject} 
            onSave={handleSaveProject}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

// Project Form Component
function ProjectForm({ project, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    location: project?.location || '',
    client: project?.client || '',
    startDate: project?.startDate || '',
    endDate: project?.endDate || '',
    budget: project?.budget || '',
    totalFloors: project?.totalFloors || 1,
    architect: project?.architect || '',
    engineer: project?.engineer || '',
    contractor: project?.contractor || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Client"
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="End Date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Total Floors"
            type="number"
            value={formData.totalFloors}
            onChange={(e) => setFormData({ ...formData, totalFloors: parseInt(e.target.value) })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Architect"
            value={formData.architect}
            onChange={(e) => setFormData({ ...formData, architect: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Engineer"
            value={formData.engineer}
            onChange={(e) => setFormData({ ...formData, engineer: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Contractor"
            value={formData.contractor}
            onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
          />
        </Grid>
      </Grid>
      
      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </DialogActions>
    </Box>
  );
}

export default Projects;