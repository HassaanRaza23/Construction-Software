# Construction Management Software

A comprehensive construction management system designed for tracking construction projects in Karachi, Pakistan. This system follows the local construction process from land acquisition to project completion.

## Features

### Project Management
- **Land Acquisition**: Track land search, feasibility studies, surveys, and purchase
- **Approvals**: Manage plan approvals, sale NOCs, and plinth verification
- **Team Management**: Assign architects, engineers, contractors, and supervisors
- **Phase Tracking**: Monitor construction phases from piling to finishing

### Construction Phases
1. **Foundation Work**
   - Piling (if required based on soil test)
   - Raft construction
   - Plinth construction

2. **Grey Structure**
   - Floor-by-floor construction tracking
   - Columns, beams, and slab progress
   - Chhat Barhai (roof completion) tracking

3. **Finishing Work**
   - Walls and partitions
   - Electrical wiring and fixtures
   - Plumbing installation
   - Gas lines
   - Door and window frames
   - Plastering and painting
   - Tiling and flooring
   - Final fittings installation

4. **Quality Control**
   - Cube test results tracking
   - Engineer inspections
   - Issue management

### Financial Management
- **BOQ Management**: Track materials, quantities, and costs
- **Payment Tracking**: Monitor all project expenses
- **Budget Analysis**: Real-time budget utilization
- **Financial Reports**: Comprehensive financial analytics

### Document Management
- Upload and store important documents
- Site plans and architectural drawings
- Test reports and approvals
- Payment receipts and contracts

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB for database
- JWT authentication
- RESTful API architecture

### Frontend
- React with TypeScript
- Material-UI for UI components
- React Router for navigation
- Recharts for data visualization
- Axios for API communication

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (already created with default values):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/construction-management
   JWT_SECRET=your-secret-key-change-this-in-production
   NODE_ENV=development
   ```

4. Start MongoDB on your system

5. Run the backend server:
   ```bash
   npm run dev
   ```

The backend will start on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (optional):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

The frontend will start on http://localhost:3000

### Running Both Together

From the root directory, you can run both frontend and backend simultaneously:

```bash
npm run install-all  # Install all dependencies
npm run dev         # Run both frontend and backend
```

## Default Users

The system allows self-registration. Create your first admin user through the registration form with role "Admin".

## Project Workflow

1. **Land Search & Acquisition**
   - Find suitable land
   - Calculate feasibility
   - Get land survey (site plan)
   - Purchase land

2. **Pre-Construction**
   - Conduct soil test
   - Hire architect for proposed plan
   - Submit for approval
   - Apply for sale NOC
   - Hire engineers

3. **Construction Preparation**
   - Create BOQ from architect/engineer requirements
   - Hire contractor
   - Assign supervisors

4. **Construction**
   - Foundation work (piling if needed, raft, plinth)
   - Get plinth verification
   - Build grey structure floor by floor
   - Start finishing work as floors complete
   - Conduct cube tests and inspections

5. **Completion**
   - Elevation work
   - Final checks
   - Project handover

## User Roles

- **Admin**: Full system access, user management
- **Manager**: Project creation and management
- **Supervisor**: Update construction progress
- **Viewer**: Read-only access

## API Documentation

The backend provides RESTful APIs for all operations:

- `/api/auth` - Authentication endpoints
- `/api/projects` - Project management
- `/api/phases` - Construction phase tracking
- `/api/boq` - Bill of Quantities management
- `/api/payments` - Payment tracking
- `/api/users` - User management
- `/api/reports` - Reporting and analytics

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.