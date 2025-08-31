// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'supervisor' | 'viewer';
  phone?: string;
  company?: string;
  isActive: boolean;
  lastLogin?: Date;
  assignedProjects?: string[];
}

// Project Types
export interface Project {
  _id: string;
  name: string;
  location: {
    address: string;
    city: string;
    area?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  landDetails: {
    area: number;
    dimensions: {
      length: number;
      width: number;
      irregularDimensions?: string;
    };
    purchaseAmount: number;
    transferFees: number;
    legalFees: number;
  };
  feasibility: {
    status: 'pending' | 'in-progress' | 'completed';
    calculatedDate?: Date;
    estimatedCost?: number;
    estimatedRevenue?: number;
    roi?: number;
    documents?: string[];
  };
  landSurvey: {
    status: 'pending' | 'completed';
    surveyDate?: Date;
    surveyorName?: string;
    sitePlan?: string;
    actualDimensions?: {
      length: number;
      width: number;
      totalArea: number;
      details?: string;
    };
  };
  soilTest: {
    status: 'pending' | 'in-progress' | 'completed';
    testDate?: Date;
    pilingRequired?: boolean;
    report?: string;
    recommendations?: string;
  };
  approvals: {
    planApproval: {
      status: 'pending' | 'submitted' | 'approved' | 'rejected';
      submissionDate?: Date;
      approvalDate?: Date;
      approvalNumber?: string;
      documents?: string[];
    };
    saleNOC: {
      status: 'pending' | 'applied' | 'approved' | 'rejected';
      applicationDate?: Date;
      approvalDate?: Date;
      nocNumber?: string;
      documents?: string[];
    };
    plinthVerification: {
      status: 'pending' | 'scheduled' | 'approved' | 'rejected';
      verificationDate?: Date;
      approvalDate?: Date;
      documents?: string[];
    };
  };
  architect?: {
    name: string;
    firmName?: string;
    contact?: string;
    email?: string;
    proposedPlan?: string;
    materialRequirements?: string[];
  };
  engineers?: Array<{
    type: 'structural' | 'electrical' | 'plumbing' | 'hvac';
    name: string;
    firmName?: string;
    contact?: string;
    email?: string;
    materialRequirements?: string[];
  }>;
  boq?: {
    createdDate?: Date;
    lastUpdated?: Date;
    document?: string;
    totalEstimate?: number;
  };
  contractor?: {
    name: string;
    company?: string;
    contact?: string;
    email?: string;
    contractAmount?: number;
    contractDocument?: string;
  };
  supervisors?: Array<{
    name: string;
    role: string;
    contact: string;
    assignedFloors?: number[];
  }>;
  status: 'land-search' | 'feasibility' | 'land-survey' | 'land-purchase' | 
         'soil-test' | 'planning' | 'approval-pending' | 'construction' | 
         'finishing' | 'completed';
  startDate?: Date;
  estimatedEndDate?: Date;
  actualEndDate?: Date;
  totalBudget: number;
  spentAmount: number;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Construction Phase Types
export interface ConstructionPhase {
  _id: string;
  project: string;
  phase: 'piling' | 'raft' | 'plinth' | 'grey-structure' | 'finishing' | 'elevation' | 'final-checks';
  floor: number;
  status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
  startDate?: Date;
  completionDate?: Date;
  estimatedDuration?: number;
  actualDuration?: number;
  progress: number;
  pilingDetails?: {
    numberOfPiles?: number;
    depth?: number;
    diameter?: number;
    completedPiles?: number;
  };
  raftDetails?: {
    thickness?: number;
    area?: number;
    concreteGrade?: string;
  };
  plinthDetails?: {
    height?: number;
    beamDetails?: string;
  };
  greyStructure?: {
    columns: {
      total: number;
      completed: number;
    };
    beams: {
      total: number;
      completed: number;
    };
    slabs: {
      area?: number;
      thickness?: number;
      chatBarhai: {
        status: 'pending' | 'in-progress' | 'completed';
        completionDate?: Date;
      };
    };
  };
  finishing?: {
    walls: {
      total: number;
      completed: number;
    };
    electrical: {
      wiringStatus: 'pending' | 'in-progress' | 'completed';
      switchBoardsInstalled?: number;
      mainBoardInstalled?: boolean;
    };
    plumbing: {
      status: 'pending' | 'in-progress' | 'completed';
      pipesInstalled?: boolean;
      fixturesInstalled?: boolean;
    };
    gasLines: {
      status: 'pending' | 'in-progress' | 'completed';
    };
    doorFrames: {
      total: number;
      installed: number;
    };
    plastering: {
      status: 'pending' | 'in-progress' | 'completed';
      area?: number;
    };
    painting: {
      status: 'pending' | 'in-progress' | 'completed';
      coats?: number;
    };
    tiling: {
      status: 'pending' | 'in-progress' | 'completed';
      area?: number;
    };
    fittings: {
      doors: { installed: number; total: number };
      windows: { installed: number; total: number };
      lights: { installed: number; total: number };
      switches: { installed: number; total: number };
      sanitaryItems: { installed: number; total: number };
    };
  };
  elevation?: {
    plasteringStatus: 'pending' | 'in-progress' | 'completed';
    paintingStatus: 'pending' | 'in-progress' | 'completed';
  };
  cubeTests?: Array<{
    testDate: Date;
    sampleLocation?: string;
    strength?: number;
    result: 'pass' | 'fail';
    report?: string;
  }>;
  engineerInspections?: Array<{
    inspectionDate: Date;
    engineerType: 'structural' | 'electrical' | 'plumbing' | 'hvac';
    engineerName?: string;
    findings?: string;
    approved: boolean;
    report?: string;
  }>;
  notes?: string;
  issues?: Array<{
    date: Date;
    description: string;
    resolved: boolean;
    resolutionDate?: Date;
  }>;
  photos?: Array<{
    url: string;
    caption?: string;
    uploadDate: Date;
  }>;
}

// BOQ Types
export interface BOQItem {
  _id: string;
  project: string;
  category: 'civil' | 'electrical' | 'plumbing' | 'finishing' | 'steel' | 'concrete' | 'labor' | 'other';
  itemName: string;
  description?: string;
  unit: string;
  quantity: number;
  ratePerUnit: number;
  totalAmount: number;
  supplier?: {
    name?: string;
    contact?: string;
  };
  orderedQuantity: number;
  receivedQuantity: number;
  usedQuantity: number;
  phase?: 'piling' | 'raft' | 'plinth' | 'grey-structure' | 'finishing' | 'elevation';
  floor?: number;
  status: 'pending' | 'ordered' | 'partial' | 'received' | 'in-use' | 'completed';
  orderDate?: Date;
  deliveryDate?: Date;
  notes?: string;
}

// Payment Types
export interface Payment {
  _id: string;
  project: string;
  type: 'land-purchase' | 'transfer-fee' | 'legal-fee' | 'contractor' | 
        'material' | 'labor' | 'consultant' | 'approval-fee' | 'other';
  paymentTo: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'cheque' | 'bank-transfer' | 'online';
  referenceNumber?: string;
  description?: string;
  category?: 'capital' | 'operational' | 'material' | 'service';
  relatedPhase?: string;
  relatedBOQItem?: string;
  receipt?: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  notes?: string;
}

// Dashboard Stats Types
export interface ProjectStats {
  projectName: string;
  status: string;
  progress: {
    percentage: string;
    completedPhases: number;
    totalPhases: number;
  };
  financial: {
    totalBudget: number;
    totalSpent: number;
    remaining: number;
    utilizationPercentage: string;
  };
  phases: {
    pending: number;
    inProgress: number;
    completed: number;
    onHold: number;
  };
}

// Report Types
export interface ProjectOverviewReport {
  project: {
    name: string;
    location: any;
    status: string;
    createdBy?: string;
  };
  phaseProgress: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    onHold: number;
  };
  financialSummary: {
    totalBudget: number;
    totalSpent: number;
    landCosts: number;
    constructionCosts: number;
    consultantCosts: number;
    remainingBudget: number;
    budgetUtilization: number;
  };
  boqSummary: {
    totalItems: number;
    totalValue: number;
    orderedValue: number;
    receivedValue: number;
    usedValue: number;
  };
  timeline: {
    projectStartDate?: Date;
    estimatedEndDate?: Date;
    actualEndDate?: Date;
    elapsedDays: number;
    remainingDays: number;
  };
  currentPhases: Array<{
    phase: string;
    floor: number;
    progress: number;
    startDate?: Date;
  }>;
  approvals: any;
  team: {
    architect?: string;
    contractor?: string;
    engineers: Array<{ type: string; name: string }>;
    supervisors: number;
  };
}