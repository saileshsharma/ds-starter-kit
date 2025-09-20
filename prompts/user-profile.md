# User Profile Page Requirements

## Page Overview
Create a comprehensive user profile page that allows users to view and edit their personal information, account settings, and preferences.

## Functional Requirements

### 1. Page Structure
- **Page Name**: UserProfile
- **Route**: /profile
- **Layout**: Stack layout with medium spacing
- **Title**: "User Profile"

### 2. Content Sections

#### Profile Header
- **Component**: Card with user information
- **Content**:
  - User avatar/initials
  - Full name (display)
  - Email address (display)
  - Member since date
  - Account status badge
- **Container**: Card with title "Profile Information"

#### Personal Information Form
- **Component**: Form with input fields
- **Fields**:
  - First Name (text input, required)
  - Last Name (text input, required)
  - Email (email input, required)
  - Phone Number (text input)
  - Bio/Description (text area)
- **Actions**:
  - Primary button: "Save Changes"
  - Secondary button: "Cancel"
- **Container**: Card with title "Personal Information"

#### Account Settings
- **Component**: Form with various controls
- **Settings**:
  - Email notifications (toggle)
  - Push notifications (toggle)
  - Privacy level (select dropdown)
  - Theme preference (select dropdown)
  - Language (select dropdown)
- **Actions**:
  - Primary button: "Update Settings"
- **Container**: Card with title "Account Settings"

#### Activity Summary
- **Component**: Stack with statistics
- **Stats**:
  - Profile views: "1,234"
  - Posts created: "56"
  - Comments made: "123"
  - Last login: "2 hours ago"
- **Container**: Card with title "Activity Summary"

### 3. Design Requirements
- Use Stack layout for vertical organization
- Apply consistent spacing between sections (spacing.6)
- Use medium shadows for cards
- Implement proper form validation
- Ensure accessible form labels
- Use appropriate input types for different fields

### 4. Data Integration
- Load user data from REST endpoint "/api/user/profile"
- Save form data to REST endpoint (PUT request)
- Handle loading and error states
- Validate required fields

### 5. User Experience
- Provide clear feedback on form submission
- Show unsaved changes warning
- Enable keyboard navigation
- Support form validation with error messages
- Include helpful placeholder text

## Expected User Workflows
1. **View Profile**: Users can see their current profile information
2. **Edit Information**: Users can update their personal details
3. **Manage Settings**: Users can configure account preferences
4. **Review Activity**: Users can see their platform activity

## Technical Constraints
- Use only components from the design system manifest
- Follow the JSON schema requirements strictly
- Implement proper form structure
- Use design tokens consistently
- Include proper validation attributes