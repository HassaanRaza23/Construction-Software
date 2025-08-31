import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Assessment as AssessmentIcon,
  Construction as ConstructionIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { projectAPI } from '../services/api';
import { Project } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectAPI.getOne(id!);
      setProject(response.data);
    } catch (err) {
      setError('Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
      'pending': 'default',
      'in-progress': 'primary',
      'completed': 'success',
      'submitted': 'info',
      'approved': 'success',
      'rejected': 'error',
      'applied': 'info',
      'scheduled': 'warning',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !project) {
    return <Alert severity="error">{error || 'Project not found'}</Alert>;
  }

  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/projects')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {project.name}
        </Typography>
        {canEdit && (
          <Button startIcon={<EditIcon />} variant="outlined">
            Edit Project
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Project Overview Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Information
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Status"
                    secondary={
                      <Chip
                        label={project.status.replace(/-/g, ' ').toUpperCase()}
                        size="small"
                        color="primary"
                      />
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Location"
                    secondary={`${project.location.area}, ${project.location.city}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Address"
                    secondary={project.location.address}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Land Area"
                    secondary={`${project.landDetails.area} sq. yards`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Total Budget"
                    secondary={formatCurrency(project.totalBudget)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Spent Amount"
                    secondary={formatCurrency(project.spentAmount)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate(`/projects/${id}/phases`)}>
                <CardContent>
                  <ConstructionIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Phases</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track construction phases
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate(`/projects/${id}/boq`)}>
                <CardContent>
                  <InventoryIcon color="secondary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">BOQ</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage materials
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate(`/projects/${id}/payments`)}>
                <CardContent>
                  <MoneyIcon color="success" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Payments</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track expenses
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => navigate(`/projects/${id}/reports`)}>
                <CardContent>
                  <AssessmentIcon color="warning" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Reports</Typography>
                  <Typography variant="body2" color="text.secondary">
                    View analytics
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Detailed Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Tabs value={tab} onChange={handleTabChange}>
              <Tab label="Land & Survey" />
              <Tab label="Approvals" />
              <Tab label="Team" />
              <Tab label="Timeline" />
            </Tabs>

            <TabPanel value={tab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Land Details
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Dimensions"
                        secondary={`${project.landDetails.dimensions.length} x ${project.landDetails.dimensions.width}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Purchase Amount"
                        secondary={formatCurrency(project.landDetails.purchaseAmount)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Transfer Fees"
                        secondary={formatCurrency(project.landDetails.transferFees)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Legal Fees"
                        secondary={formatCurrency(project.landDetails.legalFees)}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Survey & Tests
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Land Survey"
                        secondary={
                          <Chip
                            label={project.landSurvey.status}
                            size="small"
                            color={getStatusColor(project.landSurvey.status)}
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Soil Test"
                        secondary={
                          <Chip
                            label={project.soilTest.status}
                            size="small"
                            color={getStatusColor(project.soilTest.status)}
                          />
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Piling Required"
                        secondary={project.soilTest.pilingRequired ? 'Yes' : 'No'}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tab} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    Plan Approval
                  </Typography>
                  <Chip
                    label={project.approvals.planApproval.status}
                    color={getStatusColor(project.approvals.planApproval.status)}
                    sx={{ mb: 2 }}
                  />
                  {project.approvals.planApproval.approvalNumber && (
                    <Typography variant="body2">
                      Approval #: {project.approvals.planApproval.approvalNumber}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    Sale NOC
                  </Typography>
                  <Chip
                    label={project.approvals.saleNOC.status}
                    color={getStatusColor(project.approvals.saleNOC.status)}
                    sx={{ mb: 2 }}
                  />
                  {project.approvals.saleNOC.nocNumber && (
                    <Typography variant="body2">
                      NOC #: {project.approvals.saleNOC.nocNumber}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="h6" gutterBottom>
                    Plinth Verification
                  </Typography>
                  <Chip
                    label={project.approvals.plinthVerification.status}
                    color={getStatusColor(project.approvals.plinthVerification.status)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tab} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Architect
                  </Typography>
                  {project.architect ? (
                    <List>
                      <ListItem>
                        <ListItemText primary="Name" secondary={project.architect.name} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Firm" secondary={project.architect.firmName} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Contact" secondary={project.architect.contact} />
                      </ListItem>
                    </List>
                  ) : (
                    <Typography color="text.secondary">Not assigned</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Contractor
                  </Typography>
                  {project.contractor ? (
                    <List>
                      <ListItem>
                        <ListItemText primary="Name" secondary={project.contractor.name} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Company" secondary={project.contractor.company} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Contract Amount" secondary={formatCurrency(project.contractor.contractAmount || 0)} />
                      </ListItem>
                    </List>
                  ) : (
                    <Typography color="text.secondary">Not assigned</Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Engineers ({project.engineers?.length || 0})
                  </Typography>
                  {project.engineers && project.engineers.length > 0 ? (
                    <Grid container spacing={2}>
                      {project.engineers.map((engineer, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle2" color="primary">
                                {engineer.type.toUpperCase()}
                              </Typography>
                              <Typography variant="body2">{engineer.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {engineer.firmName}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography color="text.secondary">No engineers assigned</Typography>
                  )}
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tab} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Start Date
                      </Typography>
                      <Typography variant="h5">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not Set'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Estimated End Date
                      </Typography>
                      <Typography variant="h5">
                        {project.estimatedEndDate ? new Date(project.estimatedEndDate).toLocaleDateString() : 'Not Set'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Actual End Date
                      </Typography>
                      <Typography variant="h5">
                        {project.actualEndDate ? new Date(project.actualEndDate).toLocaleDateString() : 'In Progress'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectDetail;