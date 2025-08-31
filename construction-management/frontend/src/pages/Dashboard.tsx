import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Construction as ConstructionIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { projectAPI } from '../services/api';
import { Project, ProjectStats } from '../types';
import { useAuth } from '../contexts/AuthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectStats(selectedProject._id);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProject(response.data[0]);
      }
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectStats = async (projectId: string) => {
    try {
      const response = await projectAPI.getStats(projectId);
      setProjectStats(response.data);
    } catch (err) {
      console.error('Failed to fetch project stats:', err);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'land-search': '#FF9800',
      'feasibility': '#2196F3',
      'land-survey': '#03A9F4',
      'land-purchase': '#00BCD4',
      'soil-test': '#009688',
      'planning': '#4CAF50',
      'approval-pending': '#FFEB3B',
      'construction': '#FF5722',
      'finishing': '#795548',
      'completed': '#8BC34A',
    };
    return statusColors[status] || '#9E9E9E';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const phaseData = projectStats ? [
    { name: 'Pending', value: projectStats.phases.pending },
    { name: 'In Progress', value: projectStats.phases.inProgress },
    { name: 'Completed', value: projectStats.phases.completed },
    { name: 'On Hold', value: projectStats.phases.onHold },
  ] : [];

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your construction projects
        </Typography>
      </Box>

      {/* Project Selection */}
      {projects.length > 1 && (
        <Box mb={3}>
          <Grid container spacing={1}>
            {projects.map((project) => (
              <Grid item key={project._id}>
                <Chip
                  label={project.name}
                  onClick={() => setSelectedProject(project)}
                  color={selectedProject?._id === project._id ? 'primary' : 'default'}
                  variant={selectedProject?._id === project._id ? 'filled' : 'outlined'}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {selectedProject && projectStats && (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Project Progress
                      </Typography>
                      <Typography variant="h4">
                        {projectStats.progress.percentage}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {projectStats.progress.completedPhases} of {projectStats.progress.totalPhases} phases
                      </Typography>
                    </Box>
                    <ConstructionIcon fontSize="large" color="primary" />
                  </Box>
                  <Box mt={2}>
                    <LinearProgress variant="determinate" value={parseFloat(projectStats.progress.percentage)} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Budget Utilization
                      </Typography>
                      <Typography variant="h5">
                        {projectStats.financial.utilizationPercentage}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(projectStats.financial.totalSpent)} spent
                      </Typography>
                    </Box>
                    <AttachMoneyIcon fontSize="large" color="success" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Active Phases
                      </Typography>
                      <Typography variant="h4">
                        {projectStats.phases.inProgress}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Currently in progress
                      </Typography>
                    </Box>
                    <ScheduleIcon fontSize="large" color="warning" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        Project Status
                      </Typography>
                      <Typography variant="h6">
                        {selectedProject.status.replace(/-/g, ' ').toUpperCase()}
                      </Typography>
                      <Chip
                        size="small"
                        label={selectedProject.status}
                        sx={{ 
                          backgroundColor: getStatusColor(selectedProject.status),
                          color: 'white',
                          mt: 1
                        }}
                      />
                    </Box>
                    <CheckCircleIcon fontSize="large" color="success" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Phase Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={phaseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {phaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Financial Overview
                </Typography>
                <Box mt={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Budget
                      </Typography>
                      <Typography variant="h6">
                        {formatCurrency(projectStats.financial.totalBudget)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Spent
                      </Typography>
                      <Typography variant="h6" color="error">
                        {formatCurrency(projectStats.financial.totalSpent)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Remaining Budget
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {formatCurrency(projectStats.financial.remaining)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Utilization
                      </Typography>
                      <Typography variant="h6">
                        {projectStats.financial.utilizationPercentage}%
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box mt={3}>
                    <LinearProgress
                      variant="determinate"
                      value={parseFloat(projectStats.financial.utilizationPercentage)}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Activities */}
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Project Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Location"
                          secondary={`${selectedProject.location.area}, ${selectedProject.location.city}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Land Area"
                          secondary={`${selectedProject.landDetails.area} sq. yards`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Architect"
                          secondary={selectedProject.architect?.name || 'Not assigned'}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Contractor"
                          secondary={selectedProject.contractor?.name || 'Not assigned'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Start Date"
                          secondary={selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : 'Not started'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Estimated End Date"
                          secondary={selectedProject.estimatedEndDate ? new Date(selectedProject.estimatedEndDate).toLocaleDateString() : 'Not set'}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {projects.length === 0 && (
        <Alert severity="info">
          No projects found. Create your first project to get started!
        </Alert>
      )}
    </Box>
  );
};

export default Dashboard;