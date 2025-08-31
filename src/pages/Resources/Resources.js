import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Engineering as EngineeringIcon,
  Inventory as InventoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

// Mock resources data
const mockResources = {
  human: [
    {
      id: 1,
      name: 'Ahmed Khan',
      role: 'Site Engineer',
      project: 'Alpha Residency',
      phone: '+92-300-1234567',
      email: 'ahmed.khan@company.com',
      status: 'active',
      skills: ['RCC Work', 'Quality Control', 'Site Management'],
      experience: '5 years',
      hourlyRate: 'PKR 800',
      availability: 'full_time',
    },
    {
      id: 2,
      name: 'Sara Ahmed',
      role: 'Architect',
      project: 'Beta Heights',
      phone: '+92-301-2345678',
      email: 'sara.ahmed@company.com',
      status: 'active',
      skills: ['Architectural Design', 'AutoCAD', '3D Modeling'],
      experience: '8 years',
      hourlyRate: 'PKR 1200',
      availability: 'full_time',
    },
    {
      id: 3,
      name: 'Muhammad Ali',
      role: 'Contractor',
      project: 'Gamma Plaza',
      phone: '+92-302-3456789',
      email: 'm.ali@company.com',
      status: 'active',
      skills: ['Construction Management', 'Team Leadership', 'Budget Control'],
      experience: '12 years',
      hourlyRate: 'PKR 1500',
      availability: 'full_time',
    },
  ],
  equipment: [
    {
      id: 1,
      name: 'Excavator CAT 320',
      type: 'Heavy Equipment',
      project: 'Alpha Residency',
      status: 'available',
      condition: 'excellent',
      purchaseDate: '2020-03-15',
      lastMaintenance: '2024-11-20',
      nextMaintenance: '2025-02-20',
      operator: 'Ali Hassan',
      dailyRate: 'PKR 25,000',
    },
    {
      id: 2,
      name: 'Concrete Mixer 500L',
      type: 'Construction Equipment',
      project: 'Beta Heights',
      status: 'in_use',
      condition: 'good',
      purchaseDate: '2021-06-10',
      lastMaintenance: '2024-10-15',
      nextMaintenance: '2025-01-15',
      operator: 'Usman Khan',
      dailyRate: 'PKR 8,000',
    },
    {
      id: 3,
      name: 'Tower Crane 50T',
      type: 'Lifting Equipment',
      project: 'Gamma Plaza',
      status: 'maintenance',
      condition: 'maintenance',
      purchaseDate: '2019-12-01',
      lastMaintenance: '2024-12-15',
      nextMaintenance: '2024-12-25',
      operator: 'Hassan Ali',
      dailyRate: 'PKR 35,000',
    },
  ],
  materials: [
    {
      id: 1,
      name: 'Portland Cement',
      type: 'Construction Material',
      project: 'Alpha Residency',
      quantity: '500 bags',
      unit: '50kg bags',
      status: 'available',
      supplier: 'Lucky Cement',
      lastRestock: '2024-12-10',
      nextRestock: '2024-12-25',
      unitPrice: 'PKR 850',
      totalValue: 'PKR 425,000',
    },
    {
      id: 2,
      name: 'Steel Bars (Grade 60)',
      type: 'Structural Material',
      project: 'Beta Heights',
      quantity: '25 tons',
      unit: 'tons',
      status: 'low_stock',
      supplier: 'Amreli Steels',
      lastRestock: '2024-12-05',
      nextRestock: '2024-12-20',
      unitPrice: 'PKR 180,000',
      totalValue: 'PKR 4,500,000',
    },
    {
      id: 3,
      name: 'Sand (Fine)',
      type: 'Construction Material',
      project: 'Gamma Plaza',
      quantity: '100 cubic meters',
      unit: 'cubic meters',
      status: 'available',
      supplier: 'Local Quarry',
      lastRestock: '2024-12-12',
      nextRestock: '2024-12-27',
      unitPrice: 'PKR 2,500',
      totalValue: 'PKR 250,000',
    },
  ],
};

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
    case 'available':
      return 'success';
    case 'in_use':
      return 'primary';
    case 'maintenance':
    case 'low_stock':
      return 'warning';
    case 'inactive':
    case 'out_of_stock':
      return 'error';
    default:
      return 'default';
  }
};

const ResourceCard = ({ resource, type, onEdit, onDelete }) => {
  const renderHumanResource = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {resource.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {resource.role}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="textSecondary">
              {resource.project}
            </Typography>
          </Box>
        </Box>
        <Chip 
          label={resource.status.toUpperCase()} 
          color={getStatusColor(resource.status)}
          size="small"
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">Experience:</Typography>
          <Typography variant="body2">{resource.experience}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">Rate:</Typography>
          <Typography variant="body2" fontWeight="bold">{resource.hourlyRate}/hr</Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Skills:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {resource.skills.map((skill, index) => (
            <Chip key={index} label={skill} size="small" variant="outlined" />
          ))}
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body2" color="textSecondary">
            {resource.phone}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {resource.email}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(resource)} color="info">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => onDelete(resource.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  const renderEquipment = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {resource.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {resource.type}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="textSecondary">
              {resource.project}
            </Typography>
          </Box>
        </Box>
        <Chip 
          label={resource.status.toUpperCase()} 
          color={getStatusColor(resource.status)}
          size="small"
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">Condition:</Typography>
          <Typography variant="body2">{resource.condition}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">Daily Rate:</Typography>
          <Typography variant="body2" fontWeight="bold">{resource.dailyRate}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">Operator:</Typography>
          <Typography variant="body2">{resource.operator}</Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Maintenance:
        </Typography>
        <Typography variant="caption" display="block">
          Last: {new Date(resource.lastMaintenance).toLocaleDateString()}
        </Typography>
        <Typography variant="caption" display="block">
          Next: {new Date(resource.nextMaintenance).toLocaleDateString()}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => onEdit(resource)} color="info">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => onDelete(resource.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  const renderMaterial = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {resource.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {resource.type}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="textSecondary">
              {resource.project}
            </Typography>
          </Box>
        </Box>
        <Chip 
          label={resource.status.toUpperCase()} 
          color={getStatusColor(resource.status)}
          size="small"
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">Quantity:</Typography>
          <Typography variant="body2" fontWeight="bold">{resource.quantity}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">Unit Price:</Typography>
          <Typography variant="body2">{resource.unitPrice}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">Total Value:</Typography>
          <Typography variant="body2" fontWeight="bold">{resource.totalValue}</Typography>
        </Box>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Supplier: {resource.supplier}
        </Typography>
        <Typography variant="caption" display="block">
          Next Restock: {new Date(resource.nextRestock).toLocaleDateString()}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={() => onEdit(resource)} color="info">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={() => onDelete(resource.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {type === 'human' && renderHumanResource()}
        {type === 'equipment' && renderEquipment()}
        {type === 'materials' && renderMaterial()}
      </CardContent>
    </Card>
  );
};

function Resources() {
  const [resources, setResources] = useState(mockResources);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceType, setResourceType] = useState('human');
  const [tabValue, setTabValue] = useState(0);

  const handleAddResource = (type) => {
    setResourceType(type);
    setEditingResource(null);
    setOpenDialog(true);
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setOpenDialog(true);
  };

  const handleDeleteResource = (resourceId) => {
    setResources({
      ...resources,
      [resourceType]: resources[resourceType].filter(r => r.id !== resourceId)
    });
  };

  const handleSaveResource = (resourceData) => {
    if (editingResource) {
      setResources({
        ...resources,
        [resourceType]: resources[resourceType].map(r => 
          r.id === editingResource.id ? { ...r, ...resourceData } : r
        )
      });
    } else {
      const newResource = {
        ...resourceData,
        id: Date.now(),
      };
      setResources({
        ...resources,
        [resourceType]: [...resources[resourceType], newResource]
      });
    }
    setOpenDialog(false);
  };

  const getResourceCount = (type) => {
    return resources[type]?.length || 0;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Resource Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleAddResource('human')}
          >
            Add Human Resource
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleAddResource('equipment')}
          >
            Add Equipment
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleAddResource('materials')}
          >
            Add Material
          </Button>
        </Box>
      </Box>

      {/* Resource Overview Tabs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab 
              icon={<PeopleIcon />} 
              label={`Human Resources (${getResourceCount('human')})`} 
            />
            <Tab 
              icon={<EngineeringIcon />} 
              label={`Equipment (${getResourceCount('equipment')})`} 
            />
            <Tab 
              icon={<InventoryIcon />} 
              label={`Materials (${getResourceCount('materials')})`} 
            />
          </Tabs>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <Grid container spacing={3}>
        {tabValue === 0 && resources.human.map((resource) => (
          <Grid item xs={12} sm={6} lg={4} key={resource.id}>
            <ResourceCard
              resource={resource}
              type="human"
              onEdit={handleEditResource}
              onDelete={handleDeleteResource}
            />
          </Grid>
        ))}
        
        {tabValue === 1 && resources.equipment.map((resource) => (
          <Grid item xs={12} sm={6} lg={4} key={resource.id}>
            <ResourceCard
              resource={resource}
              type="equipment"
              onEdit={handleEditResource}
              onDelete={handleDeleteResource}
            />
          </Grid>
        ))}
        
        {tabValue === 2 && resources.materials.map((resource) => (
          <Grid item xs={12} sm={6} lg={4} key={resource.id}>
            <ResourceCard
              resource={resource}
              type="materials"
              onEdit={handleEditResource}
              onDelete={handleDeleteResource}
            />
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Resource Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingResource ? 'Edit Resource' : `Add New ${resourceType === 'human' ? 'Human Resource' : resourceType === 'equipment' ? 'Equipment' : 'Material'}`}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Resource form will be implemented here based on the resource type.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained">Save Resource</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Resources;