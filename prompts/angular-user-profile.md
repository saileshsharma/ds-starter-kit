# Angular User Profile Page Requirements

## Page Overview
Create a comprehensive Angular user profile page that allows users to view and edit their personal information, manage account settings, and view activity statistics using Angular Reactive Forms and services.

## Functional Requirements

### 1. Page Structure
- **Page Name**: UserProfile
- **Route**: /profile
- **Layout**: StackComponent with medium spacing
- **Title**: "User Profile"
- **Framework**: Angular with Reactive Forms

### 2. Content Sections

#### Profile Header Card
- **Component**: CardComponent with user information display
- **Content**:
  - User avatar placeholder (TextComponent with initials)
  - Full name (TextComponent with large size)
  - Email address (TextComponent with medium size)
  - Member since date (TextComponent with small size)
  - Account status badge (BadgeComponent)
- **Container**: CardComponent with title "Profile Overview"

#### Personal Information Form
- **Component**: FormComponent with Angular Reactive Forms
- **Form Fields**:
  - First Name (InputComponent with formControlName="firstName", required)
  - Last Name (InputComponent with formControlName="lastName", required)
  - Email (InputComponent with type="email", formControlName="email", required)
  - Phone Number (InputComponent with type="text", formControlName="phone")
  - Bio/Description (InputComponent with formControlName="bio")
- **Form Actions**:
  - Primary button: "Save Changes" (submit type)
  - Secondary button: "Cancel" (button type)
- **Container**: CardComponent with title "Personal Information"
- **Data Integration**: Load data from "/api/user/profile" REST endpoint

#### Account Settings Form
- **Component**: FormComponent with toggle and select controls
- **Settings Fields**:
  - Email notifications (SelectComponent with formControlName="emailNotifications")
  - Push notifications (SelectComponent with formControlName="pushNotifications")
  - Privacy level (SelectComponent with options: Public, Friends, Private)
  - Theme preference (SelectComponent with options: Light, Dark, Auto)
  - Language (SelectComponent with multiple language options)
- **Form Actions**:
  - Primary button: "Update Settings"
- **Container**: CardComponent with title "Account Settings"

#### Activity Summary Card
- **Component**: StackComponent with statistics
- **Statistics** (using StatComponent):
  - Profile views: "{{activityData.profileViews}}"
  - Posts created: "{{activityData.postsCreated}}"
  - Comments made: "{{activityData.commentsMade}}"
  - Last login: "{{activityData.lastLogin}}"
- **Container**: CardComponent with title "Activity Summary"
- **Data Integration**: Load data from GraphQL query "GET_USER_ACTIVITY"

#### Settings Modal
- **Component**: ModalComponent for advanced settings
- **Modal Properties**:
  - Title: "Advanced Settings"
  - Size: large
  - Closable: true
  - Visible: bound to component property
- **Modal Content**: FormComponent with additional settings
- **Trigger**: ButtonComponent in main form

### 3. Angular-Specific Requirements
- Use Angular Reactive Forms (FormGroup, FormControl)
- Implement proper form validation with error handling
- Use Angular services for data operations
- Implement two-way data binding where appropriate
- Use Angular event emitters for component communication
- Follow Angular component architecture patterns

### 4. Data Integration
- **User Profile Data**: REST endpoint "/api/user/profile"
- **Activity Data**: GraphQL query "GET_USER_ACTIVITY"
- **Form Submission**: PUT request to "/api/user/profile"
- **Settings Save**: POST request to "/api/user/settings"
- Use Angular services for all data operations
- Implement loading states and error handling

### 5. Form Validation
- Required field validation for name and email
- Email format validation
- Phone number format validation
- Custom validators for business rules
- Display validation errors in UI
- Disable submit button when form is invalid

### 6. User Experience
- Loading spinners during data operations
- Success/error toast notifications
- Unsaved changes warning when navigating away
- Form auto-save functionality (optional)
- Keyboard navigation support
- Mobile-responsive design

## Expected User Workflows
1. **View Profile**: Users can see their current profile information and activity
2. **Edit Information**: Users can update personal details using reactive forms
3. **Manage Settings**: Users can configure account preferences and privacy
4. **Review Activity**: Users can see their platform engagement statistics
5. **Advanced Settings**: Users can access additional configuration options via modal

## Technical Constraints
- Use only Angular components from the design system manifest
- Follow the JSON schema requirements strictly
- Implement proper Angular component structure with inputs/outputs
- Use Angular Reactive Forms for all form interactions
- Include proper TypeScript type safety
- Use Angular services for data layer integration
- Follow Angular style guide conventions

## Component Structure Notes
- All components should use "Component" suffix (e.g., CardComponent, FormComponent)
- Use `inputs` for component properties
- Use `outputs` for event emitters
- Use FormControl binding for form fields
- Implement proper data binding with Angular syntax
- Include loading and error states for data operations