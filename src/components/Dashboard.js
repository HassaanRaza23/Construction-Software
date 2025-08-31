import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  TrendingUp,
  Construction,
  CheckCircle,
  Schedule,
  Warning
} from '@mui/icons-material';
import { projects, PROJECT_PHASES, calculateProgress } from '../data/projectData';

const Dashboard = () => {
  const activeProjects = projects.filter(p => 
    p.currentPhase !== PROJECT_PHASES.POST_CONSTRUCTION || !p.progress.constructionComplete
  );
  
  const completedProjects = projects.filter(p => 
    p.currentPhase === PROJECT_PHASES.POST_CONSTRUCTION && p.progress.constructionComplete
  );

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

  const recentActivities = [
    { text: 'Gulshan Heights - Plinth verification completed', time: '2 hours ago', icon: <CheckCircle color="success" /> },
    { text: 'DHA Project - Soil test results received', time: '1 day ago', icon: <Schedule color="info" /> },
    { text: 'Clifton Tower - Plan approval pending', time: '3 days ago', icon: <Warning color="warning" /> },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Construction Management Dashboard
      </Typography>
      
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Projects
                  </Typography>
                  <Typography variant="h4">
                    {projects.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Construction color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Projects
                  </Typography>
                  <Typography variant="h4">
                    {activeProjects.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h4">
                    {completedProjects.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Avg. Progress
                  </Typography>
                  <Typography variant="h4">
                    {projects.length > 0 ? Math.round(projects.reduce((acc, p) => acc + calculateProgress(p), 0) / projects.length) : 0}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Active Projects */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Projects
            </Typography>
            {activeProjects.map((project) => (
              <Card key={project.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6">{project.name}</Typography>
                      <Typography color="textSecondary">{project.location}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Client: {project.client}
                      </Typography>
                    </Box>
                    <Chip 
                      label={getPhaseLabel(project.currentPhase)} 
                      color={getPhaseColor(project.currentPhase)}
                      size="small"
                    />
                  </Box>
                  
                  <Box mb={1}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">Progress</Typography>
                      <Typography variant="body2">{calculateProgress(project)}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={calculateProgress(project)} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  {project.currentPhase === PROJECT_PHASES.CONSTRUCTION && project.construction?.floors?.length > 0 && (
                    <Typography variant="body2" color="textSecondary">
                      Current Floor: {project.construction.currentFloor > 0 ? 
                        project.construction.floors[project.construction.currentFloor - 1]?.number : 'Ground'}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {activeProjects.length === 0 && (
              <Typography color="textSecondary" textAlign="center" py={4}>
                No active projects. Create a new project to get started.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <ListItem key={index} divider={index < recentActivities.length - 1}>
                  <ListItemIcon>
                    {activity.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.text}
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;