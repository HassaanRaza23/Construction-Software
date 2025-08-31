import React from 'react';
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
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
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
      type: 'task_completed',
      message: 'Piling work completed for Project Alpha',
      project: 'Alpha Residency',
      time: '2 hours ago',
      status: 'completed',
    },
    {
      id: 2,
      type: 'milestone_reached',
      message: 'Grey structure completed for Floor 3',
      project: 'Beta Heights',
      time: '1 day ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'inspection_scheduled',
      message: 'Engineer inspection scheduled for tomorrow',
      project: 'Gamma Plaza',
      time: '2 days ago',
      status: 'pending',
    },
    {
      id: 4,
      type: 'material_delivered',
      message: 'Steel and cement delivered to site',
      project: 'Delta Complex',
      time: '3 days ago',
      status: 'completed',
    },
  ],
  projectProgress: [
    { name: 'Alpha Residency', progress: 75, status: 'active' },
    { name: 'Beta Heights', progress: 45, status: 'active' },
    { name: 'Gamma Plaza', progress: 90, status: 'active' },
    { name: 'Delta Complex', progress: 30, status: 'active' },
    { name: 'Epsilon Tower', progress: 100, status: 'completed' },
  ],
  monthlyProgress: [
    { month: 'Jan', completed: 12, planned: 15 },
    { month: 'Feb', completed: 18, planned: 20 },
    { month: 'Mar', completed: 22, planned: 25 },
    { month: 'Apr', completed: 28, planned: 30 },
    { month: 'May', completed: 35, planned: 35 },
    { month: 'Jun', completed: 40, planned: 38 },
  ],
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
    <ListItemAvatar>
      <Avatar sx={{ 
        bgcolor: activity.status === 'completed' ? 'success.main' : 
                activity.status === 'pending' ? 'warning.main' : 'info.main' 
      }}>
        {activity.status === 'completed' ? <CheckCircleIcon /> : 
         activity.status === 'pending' ? <ScheduleIcon /> : <WarningIcon />}
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={activity.message}
      secondary={
        <React.Fragment>
          <Typography component="span" variant="body2" color="textPrimary">
            {activity.project}
          </Typography>
          {` — ${activity.time}`}
        </React.Fragment>
      }
    />
  </ListItem>
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
            title="Total Projects"
            value={mockData.stats.totalProjects}
            icon={<BusinessIcon />}
            color="primary.main"
            subtitle={`${mockData.stats.activeProjects} active`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Tasks"
            value={mockData.stats.totalTasks}
            icon={<AssignmentIcon />}
            color="success.main"
            subtitle={`${mockData.stats.completedTasks} completed`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Resources"
            value={mockData.stats.totalResources}
            icon={<PeopleIcon />}
            color="warning.main"
            subtitle={`${mockData.stats.availableResources} available`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Progress"
            value="68%"
            icon={<TrendingUpIcon />}
            color="info.main"
            subtitle="Overall completion"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Project Progress */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Progress
              </Typography>
              {mockData.projectProgress.map((project, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">{project.name}</Typography>
                    <Chip 
                      label={`${project.progress}%`} 
                      size="small" 
                      color={project.status === 'completed' ? 'success' : 'primary'}
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={project.progress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {mockData.recentActivities.map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ActivityItem activity={activity} />
                    {index < mockData.recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Progress Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Progress Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockData.monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#1976d2" name="Completed" />
                  <Bar dataKey="planned" fill="#dc004e" name="Planned" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;