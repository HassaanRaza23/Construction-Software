import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
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
  Avatar,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  PriorityHigh as PriorityHighIcon,
} from '@mui/icons-material';

// Mock tasks data
const mockTasks = [
  {
    id: 1,
    name: '3rd Floor Column Work',
    description: 'Complete RCC columns for 3rd floor',
    project: 'Alpha Residency',
    assignedTo: 'Site Engineer',
    dueDate: '2024-12-22',
    status: 'in_progress',
    priority: 'high',
    progress: 60,
    phase: 'grey_structure',
    floor: 3,
    estimatedHours: 48,
    actualHours: 28,
    dependencies: ['Material Delivery', 'Formwork Setup'],
  },
  {
    id: 2,
    name: '2nd Floor Tiling',
    description: 'Complete bathroom and kitchen tiling',
    project: 'Beta Heights',
    assignedTo: 'Tiling Team',
    dueDate: '2024-12-25',
    status: 'in_progress',
    priority: 'medium',
    progress: 40,
    phase: 'finishing',
    floor: 2,
    estimatedHours: 72,
    actualHours: 32,
    dependencies: ['Plumbing Complete', 'Electrical Rough-in'],
  },
  {
    id: 3,
    name: 'Material Procurement',
    description: 'Order steel and cement for next phase',
    project: 'Alpha Residency',
    assignedTo: 'Procurement Team',
    dueDate: '2024-12-20',
    status: 'pending',
    priority: 'high',
    progress: 0,
    phase: 'procurement',
    floor: 0,
    estimatedHours: 8,
    actualHours: 0,
    dependencies: [],
  },
  {
    id: 4,
    name: 'Foundation Piling',
    description: 'Complete piling work for new project',
    project: 'Gamma Plaza',
    assignedTo: 'Foundation Team',
    dueDate: '2024-12-28',
    status: 'pending',
    priority: 'high',
    progress: 0,
    phase: 'foundation',
    floor: 0,
    estimatedHours: 120,
    actualHours: 0,
    dependencies: ['Soil Testing', 'Equipment Setup'],
  },
  {
    id: 5,
    name: '1st Floor Finishing',
    description: 'Complete all finishing work for 1st floor',
    project: 'Beta Heights',
    assignedTo: 'Finishing Team',
    dueDate: '2024-12-30',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    phase: 'finishing',
    floor: 1,
    estimatedHours: 96,
    actualHours: 88,
    dependencies: ['Grey Structure Complete'],
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'primary';
    case 'pending': return 'warning';
    case 'delayed': return 'error';
    default: return 'default';
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'success';
    default: return 'default';
  }
};

const getPhaseColor = (phase) => {
  switch (phase) {
    case 'planning': return 'info';
    case 'foundation': return 'warning';
    case 'grey_structure': return 'primary';
    case 'finishing': return 'success';
    case 'elevation': return 'secondary';
    case 'procurement': return 'default';
    default: return 'default';
  }
};

const TaskCard = ({ task, onEdit, onDelete }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            {task.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {task.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="textSecondary">
              {task.project}
            </Typography>
            <Chip 
              label={`Floor ${task.floor}`} 
              size="small" 
              variant="outlined"
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Chip 
            label={task.status.replace('_', ' ').toUpperCase()} 
            color={getStatusColor(task.status)}
            size="small"
          />
          <Chip 
            label={task.priority.toUpperCase()} 
            color={getPriorityColor(task.priority)}
            size="small"
          />
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Progress</Typography>
          <Typography variant="body2" color="primary.main" fontWeight="bold">
            {task.progress}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={task.progress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">Assigned to:</Typography>
          <Typography variant="body2">{task.assignedTo}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">Due Date:</Typography>
          <Typography variant="body2" color={new Date(task.dueDate) < new Date() ? 'error.main' : 'inherit'}>
            {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="textSecondary">Hours:</Typography>
          <Typography variant="body2">
            {task.actualHours}/{task.estimatedHours} hrs
          </Typography>
        </Box>
      </Box>

      {task.dependencies.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Dependencies: {task.dependencies.join(', ')}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
        <Chip 
          label={task.phase.replace('_', ' ').toUpperCase()} 
          color={getPhaseColor(task.phase)}
          size="small"
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit Task">
            <IconButton size="small" onClick={() => onEdit(task)} color="info">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Task">
            <IconButton size="small" onClick={() => onDelete(task.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

function Tasks() {
  const [tasks, setTasks] = useState(mockTasks);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  const handleAddTask = () => {
    setEditingTask(null);
    setOpenDialog(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setOpenDialog(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    } else {
      const newTask = {
        ...taskData,
        id: Date.now(),
        progress: 0,
        actualHours: 0,
        dependencies: [],
      };
      setTasks([...tasks, newTask]);
    }
    setOpenDialog(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterProject !== 'all' && task.project !== filterProject) return false;
    return true;
  });

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  const projects = [...new Set(tasks.map(task => task.project))];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Task Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTask}
        >
          Add New Task
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="delayed">Delayed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  label="Priority"
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <MenuItem value="all">All Priorities</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  value={filterProject}
                  label="Project"
                  onChange={(e) => setFilterProject(e.target.value)}
                >
                  <MenuItem value="all">All Projects</MenuItem>
                  {projects.map(project => (
                    <MenuItem key={project} value={project}>{project}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setFilterStatus('all');
                  setFilterPriority('all');
                  setFilterProject('all');
                }}
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Task Overview Tabs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label={`All Tasks (${tasks.length})`} />
            <Tab label={`Pending (${getTasksByStatus('pending').length})`} />
            <Tab label={`In Progress (${getTasksByStatus('in_progress').length})`} />
            <Tab label={`Completed (${getTasksByStatus('completed').length})`} />
            <Tab label={`High Priority (${getTasksByPriority('high').length})`} />
          </Tabs>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      <Grid container spacing={3}>
        {filteredTasks.map((task) => (
          <Grid item xs={12} sm={6} lg={4} key={task.id}>
            <TaskCard
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <TaskForm 
            task={editingTask} 
            onSave={handleSaveTask}
            onCancel={() => setOpenDialog(false)}
            projects={projects}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

// Task Form Component
function TaskForm({ task, onSave, onCancel, projects }) {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    project: task?.project || '',
    assignedTo: task?.assignedTo || '',
    dueDate: task?.dueDate || '',
    priority: task?.priority || 'medium',
    phase: task?.phase || 'grey_structure',
    floor: task?.floor || 0,
    estimatedHours: task?.estimatedHours || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Task Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Project</InputLabel>
            <Select
              value={formData.project}
              label="Project"
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              required
            >
              {projects.map(project => (
                <MenuItem key={project} value={project}>{project}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Assigned To"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              required
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Phase</InputLabel>
            <Select
              value={formData.phase}
              label="Phase"
              onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
              required
            >
              <MenuItem value="planning">Planning</MenuItem>
              <MenuItem value="foundation">Foundation</MenuItem>
              <MenuItem value="grey_structure">Grey Structure</MenuItem>
              <MenuItem value="finishing">Finishing</MenuItem>
              <MenuItem value="elevation">Elevation</MenuItem>
              <MenuItem value="procurement">Procurement</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Floor"
            type="number"
            value={formData.floor}
            onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Estimated Hours"
            type="number"
            value={formData.estimatedHours}
            onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) })}
            required
          />
        </Grid>
      </Grid>
      
      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </DialogActions>
    </Box>
  );
}

export default Tasks;