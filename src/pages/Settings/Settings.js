import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Language as LanguageIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      projectUpdates: true,
      taskReminders: true,
      qualityAlerts: true,
      financialReports: false,
    },
    workflow: {
      autoTaskAssignment: true,
      qualityCheckRequired: true,
      engineerApprovalRequired: true,
      autoProgressUpdate: false,
      milestoneNotifications: true,
    },
    system: {
      language: 'en',
      timezone: 'Asia/Karachi',
      dateFormat: 'DD/MM/YYYY',
      currency: 'PKR',
      decimalPlaces: 2,
    },
    construction: {
      defaultPhases: [
        'Planning & Feasibility',
        'Foundation Work',
        'Construction',
        'Elevation & Final Work'
      ],
      qualityStandards: 'Pakistani Building Codes',
      inspectionFrequency: 'weekly',
      cubeTestRequired: true,
      engineerInspectionRequired: true,
    },
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSave = () => {
    // This would save settings to backend
    setSnackbar({
      open: true,
      message: 'Settings saved successfully!',
      severity: 'success',
    });
  };

  const handleReset = () => {
    // This would reset to default settings
    setSnackbar({
      open: true,
      message: 'Settings reset to defaults!',
      severity: 'info',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Settings & Configuration
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Notification Preferences
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Email Notifications" 
                    secondary="Receive notifications via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="SMS Notifications" 
                    secondary="Receive notifications via SMS"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.notifications.sms}
                      onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Push Notifications" 
                    secondary="Receive push notifications in app"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.notifications.push}
                      onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <Divider sx={{ my: 2 }} />
                
                <ListItem>
                  <ListItemText 
                    primary="Project Updates" 
                    secondary="Notify about project progress changes"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.notifications.projectUpdates}
                      onChange={(e) => handleSettingChange('notifications', 'projectUpdates', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Task Reminders" 
                    secondary="Send task deadline reminders"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.notifications.taskReminders}
                      onChange={(e) => handleSettingChange('notifications', 'taskReminders', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Quality Alerts" 
                    secondary="Alert about quality control issues"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.notifications.qualityAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'qualityAlerts', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Workflow Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Workflow Configuration
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Auto Task Assignment" 
                    secondary="Automatically assign tasks based on availability"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.workflow.autoTaskAssignment}
                      onChange={(e) => handleSettingChange('workflow', 'autoTaskAssignment', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Quality Check Required" 
                    secondary="Require quality checks before task completion"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.workflow.qualityCheckRequired}
                      onChange={(e) => handleSettingChange('workflow', 'qualityCheckRequired', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Engineer Approval Required" 
                    secondary="Require engineer approval for major milestones"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.workflow.engineerApprovalRequired}
                      onChange={(e) => handleSettingChange('workflow', 'engineerApprovalRequired', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Auto Progress Update" 
                    secondary="Automatically update project progress"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.workflow.autoProgressUpdate}
                      onChange={(e) => handleSettingChange('workflow', 'autoProgressUpdate', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem>
                  <ListItemText 
                    primary="Milestone Notifications" 
                    secondary="Notify when milestones are reached"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={settings.workflow.milestoneNotifications}
                      onChange={(e) => handleSettingChange('workflow', 'milestoneNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SettingsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  System Configuration
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={settings.system.language}
                      label="Language"
                      onChange={(e) => handleSettingChange('system', 'language', e.target.value)}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="ur">اردو</MenuItem>
                      <MenuItem value="ar">العربية</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={settings.system.timezone}
                      label="Timezone"
                      onChange={(e) => handleSettingChange('system', 'timezone', e.target.value)}
                    >
                      <MenuItem value="Asia/Karachi">Pakistan (PKT)</MenuItem>
                      <MenuItem value="UTC">UTC</MenuItem>
                      <MenuItem value="Asia/Dubai">Dubai (GST)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Date Format</InputLabel>
                    <Select
                      value={settings.system.dateFormat}
                      label="Date Format"
                      onChange={(e) => handleSettingChange('system', 'dateFormat', e.target.value)}
                    >
                      <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                      <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                      <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={settings.system.currency}
                      label="Currency"
                      onChange={(e) => handleSettingChange('system', 'currency', e.target.value)}
                    >
                      <MenuItem value="PKR">Pakistani Rupee (PKR)</MenuItem>
                      <MenuItem value="USD">US Dollar (USD)</MenuItem>
                      <MenuItem value="EUR">Euro (EUR)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Decimal Places"
                    type="number"
                    value={settings.system.decimalPlaces}
                    onChange={(e) => handleSettingChange('system', 'decimalPlaces', parseInt(e.target.value))}
                    inputProps={{ min: 0, max: 4 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Construction Standards */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Construction Standards
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Default Construction Phases:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {settings.construction.defaultPhases.map((phase, index) => (
                    <Chip key={index} label={phase} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Quality Standards"
                    value={settings.construction.qualityStandards}
                    onChange={(e) => handleSettingChange('construction', 'qualityStandards', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Inspection Frequency</InputLabel>
                    <Select
                      value={settings.construction.inspectionFrequency}
                      label="Inspection Frequency"
                      onChange={(e) => handleSettingChange('construction', 'inspectionFrequency', e.target.value)}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="biweekly">Bi-weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.construction.cubeTestRequired}
                        onChange={(e) => handleSettingChange('construction', 'cubeTestRequired', e.target.checked)}
                      />
                    }
                    label="Cube Test Required"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.construction.engineerInspectionRequired}
                        onChange={(e) => handleSettingChange('construction', 'engineerInspectionRequired', e.target.checked)}
                      />
                    }
                    label="Engineer Inspection Required"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  Security & Access Control
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Password Policy
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Minimum 8 characters" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Include uppercase letters" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Include numbers" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Include special characters" />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Session Management
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Session Timeout" 
                        secondary="30 minutes of inactivity"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Maximum Login Attempts" 
                        secondary="5 attempts before lockout"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Two-Factor Authentication" 
                        secondary="Required for admin accounts"
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Settings;