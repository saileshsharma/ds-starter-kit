
# Claims Dashboard Requirements

## Page Overview
Create a claims management dashboard that provides an overview of open claims, key performance indicators, and quick actions for claims processing.

## Functional Requirements

### 1. Page Structure
- **Page Name**: ClaimsDashboard
- **Route**: /claims
- **Layout**: 12-column grid with medium spacing
- **Title**: "Claims Dashboard"

### 2. Content Sections

#### Main Claims Table
- **Location**: Left side (columns 1-8)
- **Component**: DataTable with open claims
- **Data Source**: GraphQL query "GET_OPEN_CLAIMS"
- **Columns**:
  - Claim ID (key: "claimId", header: "Claim #")
  - Status (key: "status", header: "Status")
  - Owner (key: "owner", header: "Owner")
  - Amount (key: "amount", header: "Amount")
  - Created Date (key: "createdAt", header: "Created")
- **Features**: Enable sorting and pagination
- **Container**: Card with title "Open Claims"

#### KPI Section
- **Location**: Right side top (columns 9-12)
- **Components**: Multiple Stat components
- **Metrics**:
  - Average Cycle Time: "12.4d"
  - Total Claims: "247"
  - Pending Review: "23"
  - Approved Today: "8"
- **Container**: Card with title "Key Metrics"

#### Actions Section
- **Location**: Right side bottom (columns 9-12)
- **Components**: Action buttons
- **Actions**:
  - Primary button: "Create Claim"
  - Secondary button: "Export Data"
  - Link button: "View Reports"
- **Container**: Card with title "Quick Actions"

### 3. Design Requirements
- Use consistent spacing (spacing.4 for gaps)
- Apply appropriate shadows to cards (md shadow)
- Use design tokens for colors and typography
- Ensure responsive grid layout
- Follow accessibility best practices

### 4. Data Integration
- Connect DataTable to GraphQL endpoint
- Use static data for KPI stats (can be enhanced later)
- Implement proper loading states for data components

### 5. User Experience
- Provide clear visual hierarchy
- Enable efficient claims processing workflow
- Support keyboard navigation
- Include proper labels and descriptions

## Expected User Workflows
1. **View Claims**: Users can quickly scan open claims and their status
2. **Monitor Performance**: Users can track key metrics at a glance
3. **Create Claims**: Users can initiate new claim creation
4. **Export Data**: Users can export claims data for reporting
5. **Access Reports**: Users can navigate to detailed reporting

## Technical Constraints
- Use only components from the design system manifest
- Follow the JSON schema requirements strictly
- Implement proper component hierarchy
- Use design tokens consistently
- Ensure type safety for all props
