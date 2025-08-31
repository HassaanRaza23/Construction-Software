# Construction Management Software

A comprehensive construction project management system designed specifically for the Pakistani construction industry, particularly for projects in Karachi. This software tracks the complete construction lifecycle from land acquisition to project completion.

## Features

### 🏗️ Complete Project Lifecycle Management
- **Pre-Construction Phase**: Land finding, feasibility, surveys, approvals, NOCs
- **Construction Phase**: Floor-by-floor progress tracking with parallel work management
- **Post-Construction**: Final inspections, utilities, handover

### 📊 Progress Monitoring
- Real-time project progress tracking
- Phase-based workflow management
- Visual progress indicators and dashboards
- Floor-by-floor construction monitoring

### 👥 Stakeholder Management
- Architect, Engineer, Contractor, and Supervisor tracking
- Contact information and fee management
- Role-based project access

### 🧪 Quality Control
- Cube test tracking and results
- Engineer inspection scheduling
- Compliance checkpoint management
- Test result documentation

### 💰 Financial Tracking
- BOQ (Bill of Quantities) management
- Payment tracking and approvals
- Budget vs actual cost monitoring
- Legal fees and transfer cost tracking

## Technology Stack

- **Frontend**: React 19 with Material-UI
- **Routing**: React Router
- **Date Management**: Day.js with MUI Date Pickers
- **State Management**: React Hooks (upgradeable to Redux/Context)
- **Styling**: Material-UI Theme System

## Project Structure

```
src/
├── components/
│   ├── Layout.js          # Main application layout with navigation
│   ├── Dashboard.js       # Project overview and statistics
│   ├── ProjectList.js     # List of all projects
│   ├── ProjectDetails.js  # Detailed project view with progress tracking
│   └── NewProject.js      # Project creation form
├── data/
│   └── projectData.js     # Data structure and mock data
└── App.js                 # Main application component
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd construction-software
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Creating a New Project

1. Navigate to "New Project" from the sidebar
2. Fill in the project information through the step-by-step form:
   - **Basic Information**: Project name, location, client details
   - **Land Details**: Address, area, price, survey dimensions, soil test results
   - **Stakeholders**: Architect, contractor, and approval information
   - **Financial**: Budget breakdown and cost tracking

### Monitoring Project Progress

1. Go to "Projects" to see all projects
2. Click on a project to view detailed progress
3. Use the tabs to navigate between:
   - **Pre-Construction**: Task checklist and project setup
   - **Construction**: Floor-by-floor progress tracking
   - **Quality Control**: Test results and inspections
   - **Financial**: Budget and payment tracking

### Construction Phase Workflow

The system follows the Pakistani construction workflow:

1. **Foundation Work**: Piling → Raft → Plinth → Plinth Verification
2. **Floor Construction**: 
   - Grey structure (including chhat barhai)
   - Finishing work (parallel to next floor's grey structure)
3. **Quality Control**: Cube tests and engineer inspections at each stage
4. **Finishing Tasks**: Elevation work, final inspections, utilities

## Key Features Explained

### Pre-Construction Data Entry
All the essential information is captured before construction begins:
- Land details and survey information
- Soil test results and piling requirements
- Stakeholder information and contracts
- Approvals and NOC documentation
- Financial planning and budgets

### Construction Progress Tracking
- **Floor-by-Floor Monitoring**: Track grey structure and finishing work separately
- **Parallel Work Management**: Handle simultaneous grey structure and finishing work
- **Quality Checkpoints**: Integrated cube tests and engineer inspections
- **Visual Progress**: Progress bars and completion indicators

### Pakistani Construction Standards
- Follows local construction practices and terminology
- Includes Pakistan-specific approvals (NOCs, plan approvals)
- Supports local measurement units (sq yards, feet)
- Incorporates local construction phases and terminology

## Future Enhancements

- **Database Integration**: Replace mock data with proper database
- **Document Management**: Upload and manage construction documents
- **Mobile App**: Field workers can update progress on mobile
- **Reporting**: Generate progress reports and compliance documents
- **Integration**: Connect with accounting software and project management tools
- **Real-time Notifications**: Alert stakeholders about milestones and issues

## Contributing

This software is designed to be customizable for different construction workflows and regional requirements. Contributions are welcome to enhance functionality and adapt to other markets.

## License

[Add your license information here]

---

Built with ❤️ for the Pakistani construction industry