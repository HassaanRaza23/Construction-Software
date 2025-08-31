import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { createNewProject, addProject } from '../data/projectData';

const steps = [
  'Basic Information',
  'Land Details',
  'Stakeholders',
  'Financial Information'
];

const NewProject = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [project, setProject] = useState(createNewProject());
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0: // Basic Information
        if (!project.name) newErrors.name = 'Project name is required';
        if (!project.location) newErrors.location = 'Location is required';
        if (!project.client) newErrors.client = 'Client name is required';
        break;
      case 1: // Land Details
        if (!project.preConstruction.landDetails.address) {
          newErrors.landAddress = 'Land address is required';
        }
        if (!project.preConstruction.landDetails.area) {
          newErrors.landArea = 'Land area is required';
        }
        break;
      // Add more validation as needed
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      addProject(project);
      navigate('/projects');
    }
  };

  const updateProject = (path, value) => {
    const newProject = { ...project };
    const keys = path.split('.');
    let current = newProject;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setProject(newProject);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Name"
                value={project.name}
                onChange={(e) => updateProject('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={project.location}
                onChange={(e) => updateProject('location', e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client Name"
                value={project.client}
                onChange={(e) => updateProject('client', e.target.value)}
                error={!!errors.client}
                helperText={errors.client}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Expected Start Date"
                value={project.startDate}
                onChange={(date) => updateProject('startDate', date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Description"
                multiline
                rows={3}
                value={project.description || ''}
                onChange={(e) => updateProject('description', e.target.value)}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Land Information</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Land Address"
                value={project.preConstruction.landDetails.address}
                onChange={(e) => updateProject('preConstruction.landDetails.address', e.target.value)}
                error={!!errors.landAddress}
                helperText={errors.landAddress}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Land Area"
                placeholder="e.g., 500 sq yards"
                value={project.preConstruction.landDetails.area}
                onChange={(e) => updateProject('preConstruction.landDetails.area', e.target.value)}
                error={!!errors.landArea}
                helperText={errors.landArea}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Land Price"
                placeholder="e.g., PKR 25,000,000"
                value={project.preConstruction.landDetails.price}
                onChange={(e) => updateProject('preConstruction.landDetails.price', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Survey Dimensions"
                placeholder="e.g., 50ft x 90ft"
                value={project.preConstruction.landDetails.surveyDimensions}
                onChange={(e) => updateProject('preConstruction.landDetails.surveyDimensions', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Feasibility Report"
                multiline
                rows={3}
                value={project.preConstruction.landDetails.feasibilityReport}
                onChange={(e) => updateProject('preConstruction.landDetails.feasibilityReport', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Soil Test Information</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Piling Required?</FormLabel>
                <RadioGroup
                  value={project.preConstruction.soilTest.pilingRequired}
                  onChange={(e) => updateProject('preConstruction.soilTest.pilingRequired', e.target.value === 'true')}
                >
                  <FormControlLabel value={true} control={<Radio />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Soil Test Date"
                value={project.preConstruction.soilTest.testDate}
                onChange={(date) => updateProject('preConstruction.soilTest.testDate', date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Soil Test Results"
                multiline
                rows={3}
                placeholder="e.g., Soft soil - 40ft piling required"
                value={project.preConstruction.soilTest.testResults}
                onChange={(e) => updateProject('preConstruction.soilTest.testResults', e.target.value)}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Stakeholder Information</Typography>
            </Grid>
            
            {/* Architect */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Architect</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Architect Name"
                      value={project.preConstruction.stakeholders.architect.name}
                      onChange={(e) => updateProject('preConstruction.stakeholders.architect.name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Contact"
                      value={project.preConstruction.stakeholders.architect.contact}
                      onChange={(e) => updateProject('preConstruction.stakeholders.architect.contact', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Fee"
                      placeholder="e.g., PKR 500,000"
                      value={project.preConstruction.stakeholders.architect.fee}
                      onChange={(e) => updateProject('preConstruction.stakeholders.architect.fee', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Contractor */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Contractor</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Contractor Name"
                      value={project.preConstruction.stakeholders.contractor.name}
                      onChange={(e) => updateProject('preConstruction.stakeholders.contractor.name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Contact"
                      value={project.preConstruction.stakeholders.contractor.contact}
                      onChange={(e) => updateProject('preConstruction.stakeholders.contractor.contact', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Contract Amount"
                      placeholder="e.g., PKR 15,000,000"
                      value={project.preConstruction.stakeholders.contractor.contractAmount}
                      onChange={(e) => updateProject('preConstruction.stakeholders.contractor.contractAmount', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Approvals */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Approvals & NOCs</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Plan Approval Date"
                      value={project.preConstruction.approvals.planApprovalDate}
                      onChange={(date) => updateProject('preConstruction.approvals.planApprovalDate', date)}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Plan Approval Number"
                      value={project.preConstruction.approvals.planApprovalNumber}
                      onChange={(e) => updateProject('preConstruction.approvals.planApprovalNumber', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DatePicker
                      label="Sale NOC Date"
                      value={project.preConstruction.approvals.saleNocDate}
                      onChange={(date) => updateProject('preConstruction.approvals.saleNocDate', date)}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Sale NOC Number"
                      value={project.preConstruction.approvals.saleNocNumber}
                      onChange={(e) => updateProject('preConstruction.approvals.saleNocNumber', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Financial Information</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Land Amount"
                placeholder="e.g., PKR 25,000,000"
                value={project.preConstruction.financial.landAmount}
                onChange={(e) => updateProject('preConstruction.financial.landAmount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Legal Fees"
                placeholder="e.g., PKR 200,000"
                value={project.preConstruction.financial.legalFees}
                onChange={(e) => updateProject('preConstruction.financial.legalFees', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Transfer Fees"
                placeholder="e.g., PKR 150,000"
                value={project.preConstruction.financial.transferFees}
                onChange={(e) => updateProject('preConstruction.financial.transferFees', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Budget"
                placeholder="e.g., PKR 50,000,000"
                value={project.preConstruction.financial.totalBudget}
                onChange={(e) => updateProject('preConstruction.financial.totalBudget', e.target.value)}
              />
            </Grid>
          </Grid>
        );

      default:
        return (
          <Typography>Unknown step</Typography>
        );
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create New Project
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Enter all the pre-construction information to set up your project. You can update this information later as the project progresses.
      </Alert>

      <Card>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 400 }}>
            {renderStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} variant="contained">
                Create Project
              </Button>
            ) : (
              <Button onClick={handleNext} variant="contained">
                Next
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NewProject;