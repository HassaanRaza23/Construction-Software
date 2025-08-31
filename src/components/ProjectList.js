import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { projects, PROJECT_PHASES, calculateProgress } from '../data/projectData';

const ProjectList = () => {
  const navigate = useNavigate();

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

  const getStatusText = (project) => {
    if (project.progress.constructionComplete) {
      return 'Completed';
    } else if (project.progress.constructionStarted) {
      return 'In Progress';
    } else if (project.progress.preConstructionComplete) {
      return 'Ready to Start';
    } else {
      return 'Planning';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/projects/new')}
        >
          New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {project.name}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {project.location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Client: {project.client}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/projects/${project.id}`)}
                      title="View Details"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      title="Edit Project"
                    >
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Chip 
                    label={getPhaseLabel(project.currentPhase)} 
                    color={getPhaseColor(project.currentPhase)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={getStatusText(project)} 
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Overall Progress</Typography>
                    <Typography variant="body2">{calculateProgress(project)}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateProgress(project)} 
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>

                {project.startDate && (
                  <Typography variant="body2" color="textSecondary">
                    Started: {new Date(project.startDate).toLocaleDateString()}
                  </Typography>
                )}

                {project.currentPhase === PROJECT_PHASES.CONSTRUCTION && project.construction?.floors?.length > 0 && (
                  <Typography variant="body2" color="textSecondary">
                    Floors: {project.construction.floors.length} | Current: {
                      project.construction.currentFloor > 0 ? 
                      project.construction.floors[project.construction.currentFloor - 1]?.number : 'Ground'
                    }
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {projects.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No projects yet
          </Typography>
          <Typography color="textSecondary" mb={3}>
            Create your first construction project to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects/new')}
          >
            Create New Project
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProjectList;