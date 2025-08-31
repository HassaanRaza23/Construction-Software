import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { projectAPI } from '../services/api';
import { Project } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: {
      address: '',
      city: 'Karachi',
      area: '',
    },
    landDetails: {
      area: 0,
      dimensions: {
        length: 0,
        width: 0,
      },
      purchaseAmount: 0,
      transferFees: 0,
      legalFees: 0,
    },
    totalBudget: 0,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      await projectAPI.create(formData);
      setOpenDialog(false);
      fetchProjects();
      setFormData({
        name: '',
        location: {
          address: '',
          city: 'Karachi',
          area: '',
        },
        landDetails: {
          area: 0,
          dimensions: {
            length: 0,
            width: 0,
          },
          purchaseAmount: 0,
          transferFees: 0,
          legalFees: 0,
        },
        totalBudget: 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create project');
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'land-search': 'default',
      'feasibility': 'info',
      'land-survey': 'info',
      'land-purchase': 'warning',
      'soil-test': 'warning',
      'planning': 'primary',
      'approval-pending': 'warning',
      'construction': 'primary',
      'finishing': 'secondary',
      'completed': 'success',
    };
    return statusColors[status] || 'default';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (project: Project) => {
    const statusOrder = [
      'land-search', 'feasibility', 'land-survey', 'land-purchase',
      'soil-test', 'planning', 'approval-pending', 'construction',
      'finishing', 'completed'
    ];
    const currentIndex = statusOrder.indexOf(project.status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const canCreateProject = user?.role === 'admin' || user?.role === 'manager';

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Projects</Typography>
        {canCreateProject && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            New Project
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {project.name}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {project.location.area}, {project.location.city}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <MoneyIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Budget: {formatCurrency(project.totalBudget)}
                  </Typography>
                </Box>
                <Chip
                  label={project.status.replace(/-/g, ' ').toUpperCase()}
                  color={getStatusColor(project.status) as any}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{calculateProgress(project).toFixed(0)}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={calculateProgress(project)} />
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Project Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Location Details</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Address"
                value={formData.location.address}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, address: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Area"
                value={formData.location.area}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, area: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Land Details</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Land Area (sq. yards)"
                type="number"
                value={formData.landDetails.area}
                onChange={(e) => setFormData({
                  ...formData,
                  landDetails: { ...formData.landDetails, area: parseFloat(e.target.value) }
                })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Length"
                type="number"
                value={formData.landDetails.dimensions.length}
                onChange={(e) => setFormData({
                  ...formData,
                  landDetails: {
                    ...formData.landDetails,
                    dimensions: { ...formData.landDetails.dimensions, length: parseFloat(e.target.value) }
                  }
                })}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Width"
                type="number"
                value={formData.landDetails.dimensions.width}
                onChange={(e) => setFormData({
                  ...formData,
                  landDetails: {
                    ...formData.landDetails,
                    dimensions: { ...formData.landDetails.dimensions, width: parseFloat(e.target.value) }
                  }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Financial Details</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Purchase Amount"
                type="number"
                value={formData.landDetails.purchaseAmount}
                onChange={(e) => setFormData({
                  ...formData,
                  landDetails: { ...formData.landDetails, purchaseAmount: parseFloat(e.target.value) }
                })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Budget"
                type="number"
                value={formData.totalBudget}
                onChange={(e) => setFormData({
                  ...formData,
                  totalBudget: parseFloat(e.target.value)
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained">
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects;