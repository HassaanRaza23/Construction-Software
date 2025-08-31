import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Construction as ConstructionIcon,
  Foundation as FoundationIcon,
  Home as HomeIcon,
  Engineering as EngineeringIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = {
  stats: {
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 3,
    delayedProjects: 1,
    totalTasks: 156,
    completedTasks: 89,
    totalResources: 45,
    availableResources: 23,
  },
  recentActivities: [
    {
      id: 1,
      type: 'construction_progress',
      message: '3rd Floor Grey Structure - Columns in progress',
      project: 'Alpha Residency',
      time: '2 hours ago',
      status: 'in_progress',
      phase: 'Grey Structure',
      floor: '3rd Floor',
    },
    {
      id: 2,
      type: 'quality_check',
      message: '2nd Floor Finishing - Engineer inspection completed',
      project: 'Beta Heights',
      time: '1 day ago',
      status: 'completed',
      phase: 'Finishing',
      floor: '2nd Floor',
    },
    {
      id: 3,
      type: 'foundation_complete',
      message: 'Foundation work completed - Ready for grey structure',
      project: 'Gamma Plaza',
      time: '2 days ago',
      status: 'completed',
      phase: 'Foundation',
      floor: 'Ground',
    },
    {
      id: 4,
      type: 'material_delivered',
      message: 'Steel and cement delivered for 3rd floor',
      project: 'Alpha Residency',
      time: '3 days ago',
      status: 'completed',
      phase: 'Materials',
      floor: '3rd Floor',
    },
  ],
  constructionProgress: [
    { 
      name: 'Alpha Residency', 
      progress: 75, 
      status: 'construction',
      currentPhase: '3rd Floor Grey Structure',
      nextMilestone: '3rd Floor Chhat Barhai',
      foundation: 100,
      greyStructure: 60,
      finishing: 40,
    },
    { 
      name: 'Beta Heights', 
      progress: 45, 
      status: 'construction',
      currentPhase: '2nd Floor Finishing',
      nextMilestone: '2nd Floor Completion',
      foundation: 100,
      greyStructure: 50,
      finishing: 30,
    },
    { 
      name: 'Gamma Plaza', 
      progress: 90, 
      status: 'construction',
      currentPhase: 'Foundation Complete',
      nextMilestone: 'Ground Floor Grey Structure',
      foundation: 100,
      greyStructure: 0,
      finishing: 0,
    },
    { 
      name: 'Delta Complex', 
      progress: 30, 
      status: 'construction',
      currentPhase: 'Foundation - Piling',
      nextMilestone: 'Raft Foundation',
      foundation: 25,
      greyStructure: 0,
      finishing: 0,
    },
    { 
      name: 'Epsilon Tower', 
      progress: 100, 
      status: 'completed',
      currentPhase: 'Project Completed',
      nextMilestone: 'Handover Complete',
      foundation: 100,
      greyStructure: 100,
      finishing: 100,
    },
  ],
  monthlyProgress: [
    { month: 'Jan', foundation: 12, greyStructure: 8, finishing: 5 },
    { month: 'Feb', foundation: 18, greyStructure: 15, finishing: 10 },
    { month: 'Mar', foundation: 22, greyStructure: 20, finishing: 18 },
    { month: 'Apr', foundation: 28, greyStructure: 25, finishing: 22 },
    { month: 'May', foundation: 35, greyStructure: 30, finishing: 28 },
    { month: 'Jun', foundation: 40, greyStructure: 35, finishing: 32 },
  ],
  qualityMetrics: {
    cubeTests: { total: 45, passed: 42, failed: 3, passRate: 93.3 },
    inspections: { total: 28, passed: 25, failed: 3, passRate: 89.3 },
    materialTests: { total: 32, passed: 30, failed: 2, passRate: 93.8 },
  },
  upcomingMilestones: [
    {
      project: 'Alpha Residency',
      milestone: '3rd Floor Chhat Barhai',
      dueDate: '2024-12-25',
      status: 'on_track',
    },
    {
      project: 'Beta Heights',
      milestone: '2nd Floor Completion',
      dueDate: '2024-12-30',
      status: 'on_track',
    },
    {
      project: 'Gamma Plaza',
      milestone: 'Ground Floor Grey Structure',
      dueDate: '2025-01-05',
      status: 'on_track',
    },
  ],
};

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'primary';
    case 'construction': return 'primary';
    case 'on_track': return 'success';
    case 'delayed': return 'error';
    default: return 'default';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed': return <CheckCircleIcon />;
    case 'in_progress': return <ConstructionIcon />;
    case 'construction': return <ConstructionIcon />;
    case 'on_track': return <CheckCircleIcon />;
    case 'delayed': return <WarningIcon />;
    default: return <ScheduleIcon />;
  }
};

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const ActivityItem = ({ activity }) => (
  <ListItem alignItems="flex-start">
    <ListItemIcon>
      <Avatar sx={{ 
        bgcolor: activity.status === 'completed' ? 'success.main' : 
                activity.status === 'in_progress' ? 'primary.main' : 'info.main' 
      }}>
        {activity.status === 'completed' ? <CheckCircleIcon /> : 
         activity.status === 'in_progress' ? <ConstructionIcon /> : <ScheduleIcon />}
      </Avatar>
    </ListItemIcon>
    <ListItemText
      primary={activity.message}
      secondary={
        <React.Fragment>
          <Typography component="span" variant="body2" color="textPrimary">
            {activity.project} - {activity.phase} ({activity.floor})
          </Typography>
          {` — ${activity.time}`}
        </React.Fragment>
      }
    />
  </ListItem>
);

const ProjectProgressCard = ({ project }) => (
  <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          {project.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {project.currentPhase}
        </Typography>
      </Box>
      <Chip 
        label={`${project.progress}%`} 
        size="small" 
        color={project.status === 'completed' ? 'success' : 'primary'}
      />
    </Box>
    
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">Foundation</Typography>
        <Typography variant="body2" color="primary.main" fontWeight="bold">
          {project.foundation}%
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={project.foundation} 
        sx={{ height: 6, borderRadius: 3, mb: 1 }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">Grey Structure</Typography>
        <Typography variant="body2" color="primary.main" fontWeight="bold">
          {project.greyStructure}%
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={project.greyStructure} 
        sx={{ height: 6, borderRadius: 3, mb: 1 }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">Finishing</Typography>
        <Typography variant="body2" color="primary.main" fontWeight="bold">
          {project.finishing}%
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={project.finishing} 
        sx={{ height: 6, borderRadius: 3 }}
      />
    </Box>
    
    <Typography variant="body2" color="textSecondary">
      Next: {project.nextMilestone}
    </Typography>
  </Box>
);

const MilestoneCard = ({ milestone }) => (
  <Box sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <Typography variant="body2" fontWeight="bold">
        {milestone.project}
      </Typography>
      <Chip 
        label={milestone.status.replace('_', ' ').toUpperCase()} 
        color={getStatusColor(milestone.status)}
        size="small"
      />
    </Box>
    <Typography variant="body2" color="textSecondary" gutterBottom>
      {milestone.milestone}
    </Typography>
    <Typography variant="caption" color="textSecondary">
      Due: {new Date(milestone.dueDate).toLocaleDateString()}
    </Typography>
  </Box>
);

function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Construction Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Projects"
            value={mockData.stats.activeProjects}
            icon={<BusinessIcon />}
            color="primary.main"
            subtitle={`${mockData.stats.totalProjects} total projects`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Construction Tasks"
            value={mockData.stats.totalTasks}
            icon={<AssignmentIcon />}
            color="success.main"
            subtitle={`${mockData.stats.completedTasks} completed`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Site Resources"
            value={mockData.stats.totalResources}
            icon={<PeopleIcon />}
            color="warning.main"
            subtitle={`${mockData.stats.availableResources} available`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Overall Progress"
            value="68%"
            icon={<TrendingUpIcon />}
            color="info.main"
            subtitle="Average completion"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Construction Progress */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Construction Progress by Project
              </Typography>
              {mockData.constructionProgress.map((project, index) => (
                <ProjectProgressCard key={index} project={project} />
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities & Upcoming Milestones */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Construction Activities
              </Typography>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {mockData.recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ActivityItem activity={activity} />
                    {index < mockData.recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Milestones
              </Typography>
              {mockData.upcomingMilestones.map((milestone, index) => (
                <MilestoneCard key={index} milestone={milestone} />
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Construction Progress Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Construction Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData.monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="foundation" fill="#1976d2" name="Foundation" />
                  <Bar dataKey="greyStructure" fill="#2e7d32" name="Grey Structure" />
                  <Bar dataKey="finishing" fill="#ed6c02" name="Finishing" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quality Control Metrics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quality Control Metrics
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Cube Tests</Typography>
                  <Chip 
                    label={`${mockData.qualityMetrics.cubeTests.passRate}%`} 
                    color={mockData.qualityMetrics.cubeTests.passRate >= 90 ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Passed: {mockData.qualityMetrics.cubeTests.passed}/{mockData.qualityMetrics.cubeTests.total}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Engineer Inspections</Typography>
                  <Chip 
                    label={`${mockData.qualityMetrics.inspections.passRate}%`} 
                    color={mockData.qualityMetrics.inspections.passRate >= 90 ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Passed: {mockData.qualityMetrics.inspections.passed}/{mockData.qualityMetrics.inspections.total}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Material Tests</Typography>
                  <Chip 
                    label={`${mockData.qualityMetrics.materialTests.passRate}%`} 
                    color={mockData.qualityMetrics.materialTests.passRate >= 90 ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Passed: {mockData.qualityMetrics.materialTests.passed}/{mockData.qualityMetrics.materialTests.total}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AddIcon />}
                    sx={{ height: 80 }}
                  >
                    New Project
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<AssignmentIcon />}
                    sx={{ height: 80 }}
                  >
                    Update Progress
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EngineeringIcon />}
                    sx={{ height: 80 }}
                  >
                    Quality Check
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<TrendingUpIcon />}
                    sx={{ height: 80 }}
                  >
                    View Reports
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;