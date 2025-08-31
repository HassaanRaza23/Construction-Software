// Mock data structure for construction projects
// In a real application, this would be replaced with a proper database

export const PROJECT_PHASES = {
  PRE_CONSTRUCTION: 'pre_construction',
  CONSTRUCTION: 'construction',
  POST_CONSTRUCTION: 'post_construction'
};

export const TASK_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled'
};

// Pre-construction phase tasks
export const PRE_CONSTRUCTION_TASKS = [
  { id: 'land_finding', name: 'Find Land', order: 1 },
  { id: 'feasibility', name: 'Calculate Feasibility', order: 2 },
  { id: 'land_survey', name: 'Land Survey (Site Plan)', order: 3 },
  { id: 'land_purchase', name: 'Land Purchase', order: 4 },
  { id: 'soil_test', name: 'Soil Test', order: 5 },
  { id: 'architect_hiring', name: 'Hire Architect', order: 6 },
  { id: 'plan_drawing', name: 'Proposed Plan Drawing', order: 7 },
  { id: 'plan_submission', name: 'Plan Submission for Approval', order: 8 },
  { id: 'plan_approval', name: 'Plan Approval', order: 9 },
  { id: 'sale_noc_application', name: 'Apply for Sale NOC', order: 10 },
  { id: 'sale_noc_received', name: 'Receive Sale NOC', order: 11 },
  { id: 'engineers_hiring', name: 'Hire Engineers', order: 12 },
  { id: 'material_requirements', name: 'Material Requirements List', order: 13 },
  { id: 'boq_creation', name: 'Create BOQ', order: 14 },
  { id: 'contractor_hiring', name: 'Hire Contractor', order: 15 },
  { id: 'supervision_staff', name: 'Hire Supervising Staff', order: 16 },
  { id: 'legal_payments', name: 'Legal Fees & Transfer Payments', order: 17 }
];

// Construction phase tasks
export const CONSTRUCTION_TASKS = [
  { id: 'piling', name: 'Piling (if needed)', order: 1, hasTest: true },
  { id: 'raft', name: 'Raft Foundation', order: 2, hasTest: true },
  { id: 'plinth', name: 'Plinth Construction', order: 3, hasTest: true },
  { id: 'plinth_verification', name: 'Plinth Verification', order: 4, isApproval: true },
  { id: 'grey_structure', name: 'Grey Structure', order: 5, isFloorBased: true, hasTest: true },
  { id: 'finishing_work', name: 'Finishing Work', order: 6, isFloorBased: true, isParallel: true }
];

// Finishing work sub-tasks
export const FINISHING_SUBTASKS = [
  { id: 'walls', name: 'Wall Construction', order: 1 },
  { id: 'electrical_wiring', name: 'Electrical Wiring', order: 2 },
  { id: 'switchboard_placement', name: 'Switch Board & Main Board Placement', order: 3 },
  { id: 'plumbing', name: 'Plumbing Installation', order: 4 },
  { id: 'gas_lines', name: 'Gas Lines Installation', order: 5 },
  { id: 'door_frames', name: 'Door Frames Installation', order: 6 },
  { id: 'plastering', name: 'Plastering', order: 7 },
  { id: 'painting', name: 'Painting', order: 8 },
  { id: 'tiling', name: 'Tiling', order: 9 },
  { id: 'fittings', name: 'Fittings Installation (Doors, Windows, Lights, Switches, Sanitary)', order: 10 }
];

// Post-construction tasks
export const POST_CONSTRUCTION_TASKS = [
  { id: 'elevation_plastering', name: 'Elevation Plastering', order: 1 },
  { id: 'elevation_painting', name: 'Elevation Painting', order: 2 },
  { id: 'final_checks', name: 'Final Checks & Inspections', order: 3 },
  { id: 'utilities_connection', name: 'Utilities Connection', order: 4 },
  { id: 'occupancy_certificate', name: 'Occupancy Certificate', order: 5 },
  { id: 'handover', name: 'Project Handover', order: 6 }
];

// Sample project data structure
export const createNewProject = () => ({
  id: Date.now().toString(),
  name: '',
  location: '',
  client: '',
  startDate: null,
  expectedEndDate: null,
  actualEndDate: null,
  currentPhase: PROJECT_PHASES.PRE_CONSTRUCTION,
  
  // Pre-construction data
  preConstruction: {
    landDetails: {
      address: '',
      area: '',
      price: '',
      surveyDimensions: '',
      feasibilityReport: ''
    },
    soilTest: {
      pilingRequired: null,
      testResults: '',
      testDate: null
    },
    approvals: {
      planApprovalDate: null,
      planApprovalNumber: '',
      saleNocDate: null,
      saleNocNumber: ''
    },
    stakeholders: {
      architect: { name: '', contact: '', fee: '' },
      engineers: [],
      contractor: { name: '', contact: '', contractAmount: '' },
      supervisors: []
    },
    financial: {
      landAmount: '',
      legalFees: '',
      transferFees: '',
      totalBudget: ''
    }
  },
  
  // Construction tracking
  construction: {
    floors: [],
    currentFloor: 0,
    tasks: {},
    qualityControl: {
      cubeTests: [],
      engineerInspections: []
    }
  },
  
  // Overall progress
  progress: {
    preConstructionComplete: false,
    constructionStarted: false,
    constructionComplete: false,
    overallProgress: 0
  }
});

// Mock data for development
export let projects = [
  {
    ...createNewProject(),
    id: '1',
    name: 'Gulshan Heights',
    location: 'Gulshan-e-Iqbal, Karachi',
    client: 'ABC Developers',
    startDate: '2024-01-15',
    currentPhase: PROJECT_PHASES.CONSTRUCTION,
    preConstruction: {
      landDetails: {
        address: 'Block 13-A, Gulshan-e-Iqbal',
        area: '500 sq yards',
        price: 'PKR 25,000,000',
        surveyDimensions: '50ft x 90ft',
        feasibilityReport: 'Approved - High ROI potential'
      },
      soilTest: {
        pilingRequired: true,
        testResults: 'Soft soil - 40ft piling required',
        testDate: '2024-01-20'
      },
      stakeholders: {
        architect: { name: 'Arch. Ahmed Khan', contact: '0300-1234567', fee: 'PKR 500,000' },
        contractor: { name: 'Karachi Builders', contact: '0321-9876543', contractAmount: 'PKR 15,000,000' },
        engineers: [],
        supervisors: []
      },
      approvals: {
        planApprovalDate: '2024-01-25',
        planApprovalNumber: 'PA-2024-001',
        saleNocDate: '2024-02-01',
        saleNocNumber: 'NOC-2024-001'
      },
      financial: {
        landAmount: 'PKR 25,000,000',
        legalFees: 'PKR 200,000',
        transferFees: 'PKR 150,000',
        totalBudget: 'PKR 50,000,000'
      }
    },
    construction: {
      floors: [
        { number: 'Ground', greyStructureComplete: true, finishingComplete: false },
        { number: 'First', greyStructureComplete: false, finishingComplete: false }
      ],
      currentFloor: 1
    },
    progress: {
      preConstructionComplete: true,
      constructionStarted: true,
      overallProgress: 35
    }
  }
];

// Helper functions
export const addProject = (project) => {
  projects.push({ ...project, id: Date.now().toString() });
};

export const updateProject = (id, updates) => {
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = { ...projects[index], ...updates };
  }
};

export const getProject = (id) => {
  return projects.find(p => p.id === id);
};

export const calculateProgress = (project) => {
  // Calculate overall progress based on completed tasks
  let totalTasks = PRE_CONSTRUCTION_TASKS.length;
  let completedTasks = 0;
  
  if (project.progress.preConstructionComplete) {
    completedTasks += PRE_CONSTRUCTION_TASKS.length;
  }
  
  // Add construction tasks calculation
  if (project.construction.floors.length > 0) {
    totalTasks += project.construction.floors.length * (CONSTRUCTION_TASKS.length + FINISHING_SUBTASKS.length);
    
    project.construction.floors.forEach(floor => {
      if (floor.greyStructureComplete) {
        completedTasks += CONSTRUCTION_TASKS.length;
      }
      if (floor.finishingComplete) {
        completedTasks += FINISHING_SUBTASKS.length;
      }
    });
  }
  
  return Math.round((completedTasks / totalTasks) * 100);
};