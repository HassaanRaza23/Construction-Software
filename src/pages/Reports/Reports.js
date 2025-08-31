import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

// Mock data for reports
const mockReportData = {
  projectProgress: [
    { name: 'Alpha Residency', progress: 75, planned: 80, actual: 75 },
    { name: 'Beta Heights', progress: 45, planned: 50, actual: 45 },
    { name: 'Gamma Plaza', progress: 90, planned: 85, actual: 90 },
    { name: 'Delta Complex', progress: 30, planned: 35, actual: 30 },
    { name: 'Epsilon Tower', progress: 100, planned: 100, actual: 100 },
  ],
  monthlyProgress: [
    { month: 'Jan', planned: 15, actual: 12, variance: -3 },
    { month: 'Feb', planned: 20, actual: 18, variance: -2 },
    { month: 'Mar', planned: 25, actual: 22, variance: -3 },
    { month: 'Apr', planned: 30, actual: 28, variance: -2 },
    { month: 'May', planned: 35, actual: 35, variance: 0 },
    { month: 'Jun', planned: 38, actual: 40, variance: 2 },
  ],
  financialSummary: [
    { category: 'Land & Legal', budget: 60000000, spent: 60000000, remaining: 0 },
    { category: 'Foundation', budget: 30000000, spent: 30000000, remaining: 0 },
    { category: 'Construction', budget: 120000000, spent: 97500000, remaining: 22500000 },
    { category: 'Finishing', budget: 40000000, spent: 0, remaining: 40000000 },
  ],
  qualityMetrics: [
    { metric: 'Cube Tests', total: 45, passed: 42, failed: 3, passRate: 93.3 },
    { metric: 'Inspections', total: 28, passed: 25, failed: 3, passRate: 89.3 },
    { metric: 'Material Tests', total: 32, passed: 30, failed: 2, passRate: 93.8 },
  ],
  resourceUtilization: [
    { resource: 'Site Engineers', allocated: 8, available: 12, utilization: 66.7 },
    { resource: 'Laborers', allocated: 45, available: 60, utilization: 75.0 },
    { resource: 'Equipment', allocated: 15, available: 20, utilization: 75.0 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function Reports() {
  const [selectedProject, setSelectedProject] = useState('all');
  const [reportPeriod, setReportPeriod] = useState('monthly');

  const projects = ['all', 'Alpha Residency', 'Beta Heights', 'Gamma Plaza', 'Delta Complex', 'Epsilon Tower'];

  const downloadReport = (type) => {
    // This would generate and download the actual report
    console.log(`Downloading ${type} report for ${selectedProject}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Reports & Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Project</InputLabel>
            <Select
              value={selectedProject}
              label="Project"
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              {projects.map(project => (
                <MenuItem key={project} value={project}>
                  {project === 'all' ? 'All Projects' : project}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={reportPeriod}
              label="Period"
              onChange={(e) => setReportPeriod(e.target.value)}
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Project Progress Overview */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Project Progress Overview
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => downloadReport('progress')}
                >
                  Download Report
                </Button>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockReportData.projectProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="planned" fill="#8884d8" name="Planned" />
                  <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Progress Trend */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Progress Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockReportData.monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="planned" stackId="1" stroke="#8884d8" fill="#8884d8" name="Planned" />
                  <Area type="monotone" dataKey="actual" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Summary */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Summary
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockReportData.financialSummary}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, spent }) => `${category}: ${Math.round(spent / 1000000)}M`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="spent"
                  >
                    {mockReportData.financialSummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Quality Metrics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quality Control Metrics
              </Typography>
              {mockReportData.qualityMetrics.map((metric) => (
                <Box key={metric.metric} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {metric.metric}
                    </Typography>
                    <Chip 
                      label={`${metric.passRate}%`} 
                      color={metric.passRate >= 90 ? 'success' : metric.passRate >= 80 ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Passed: {metric.passed}/{metric.total} | Failed: {metric.failed}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Resource Utilization */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resource Utilization
              </Typography>
              {mockReportData.resourceUtilization.map((resource) => (
                <Box key={resource.resource} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {resource.resource}
                    </Typography>
                    <Chip 
                      label={`${resource.utilization}%`} 
                      color={resource.utilization >= 80 ? 'success' : resource.utilization >= 60 ? 'warning' : 'error'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Allocated: {resource.allocated} | Available: {resource.available}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Key Performance Indicators */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Key Performance Indicators
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      68%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Overall Progress
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <ScheduleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                      85%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      On Schedule
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      12%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Delayed Tasks
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      92%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Quality Pass Rate
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;