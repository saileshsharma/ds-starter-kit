# 🎯 Usage Examples - AI Builder for Angular

## 🚀 Quick Examples for Common Use Cases

### 1. **Get Started with Generic Demo**
```bash
npm install
npm run ai:demo
# ✅ Creates: src/pages/demopage.component.ts
# Shows all your design system components in action
```

### 2. **Create Common Page Types**

#### 📊 Dashboard Page
```bash
npm run ai:create:dashboard
# ✅ Creates: src/pages/dashboard.component.ts
# Includes: Stats, charts, data tables, KPI cards
```

#### 📝 Form Page
```bash
npm run ai:create:form
# ✅ Creates: src/pages/formpage.component.ts
# Includes: Input fields, dropdowns, validation, submit buttons
```

#### 📋 Data Listing Page
```bash
npm run ai:create:listing
# ✅ Creates: src/pages/datalisting.component.ts
# Includes: Search, filters, pagination, sortable tables
```

#### ⚙️ Settings Page
```bash
npm run ai:create:settings
# ✅ Creates: src/pages/settingspage.component.ts
# Includes: User preferences, configuration options, save actions
```

### 3. **Interactive Page Creator**
```bash
npm run ai:create
# Shows interactive menu with all available templates
# Choose from dashboard, form, listing, settings, or custom prompt
```

### 4. **AI-Powered Custom Pages** (Requires API Key)
```bash
# Create a custom prompt
echo "Create a user profile page with avatar upload,
bio form, social links, and activity timeline" > prompts/profile.md

# Generate with AI
OPENAI_API_KEY=sk-xxx npm run ai:build -- --prompt prompts/profile.md
```

### 5. **Watch Mode for Development**
```bash
npm run ai:demo:watch
# Watches examples/generic-page-demo.spec.json
# Auto-regenerates when you modify the specification
```

## 🎨 Customizing Your Design System

### Update Available Components
```bash
# Edit your component manifest
vim design-system/components.manifest.json

# Add your own components:
{
  "MyCustomComponent": {
    "selector": "app-custom",
    "module": "@your-company/ui",
    "inputs": {
      "variant": { "type": "enum", "values": ["primary", "secondary"] }
    }
  }
}
```

### Update Design Tokens
```bash
# Edit your design tokens
vim design-system/tokens.json

# Customize colors, spacing, typography:
{
  "colors": {
    "brand.primary": "#YOUR_BRAND_COLOR",
    "brand.secondary": "#YOUR_SECONDARY_COLOR"
  },
  "spacing": {
    "4": "16px",
    "6": "24px"
  }
}
```

## 📋 Working with Specifications

### Modify Existing Specifications
```bash
# Copy and customize an existing spec
cp examples/generic-page-demo.spec.json examples/my-page.spec.json

# Edit the specification
vim examples/my-page.spec.json

# Generate from your custom spec
npm run ai:build -- --from-spec examples/my-page.spec.json
```

### Example Specification Structure
```json
{
  "page": "MyPage",
  "route": "/my-page",
  "meta": {
    "title": "My Custom Page",
    "description": "A page built with my design system"
  },
  "sections": [
    {
      "type": "CardComponent",
      "inputs": {
        "title": "Welcome",
        "subtitle": "This is my custom page"
      },
      "children": [
        {
          "type": "ButtonComponent",
          "text": "Click Me",
          "inputs": {
            "variant": "primary",
            "size": "md"
          },
          "outputs": {
            "click": "onButtonClick"
          }
        }
      ]
    }
  ]
}
```

## 🔧 Development Workflow

### 1. Rapid Prototyping
```bash
# Start with a template
npm run ai:create:dashboard

# Customize the generated specification
vim examples/dashboard.spec.json

# Watch for changes during development
npm run ai:demo:watch
```

### 2. Quality Assurance
```bash
# Validate your specifications
npm run ai:validate examples/*.spec.json

# Run quality checks
npm run ai:quality examples/dashboard.spec.json

# Format generated code
npm run format
```

### 3. Production Workflow
```bash
# Generate with validation and formatting
node scripts/ai-build/run.mjs \
  --from-spec examples/my-page.spec.json \
  --validate \
  --format \
  --out src/components
```

## 🎯 Use Case Examples

### E-commerce Product Page
```bash
echo "Create a product detail page with:
- Product image gallery
- Product info (name, price, description)
- Add to cart button and quantity selector
- Product reviews section
- Related products grid" > prompts/product-page.md

OPENAI_API_KEY=sk-xxx npm run ai:build -- --prompt prompts/product-page.md
```

### Admin User Management
```bash
npm run ai:create:listing
# Modify the generated specification to include:
# - User table with roles and permissions
# - Add/Edit/Delete actions
# - Bulk operations
# - User status toggles
```

### Contact Form
```bash
npm run ai:create:form
# Customize for contact form:
# - Name, email, subject, message fields
# - File attachment support
# - Submit confirmation
# - Validation rules
```

### Analytics Dashboard
```bash
npm run ai:create:dashboard
# Enhance with:
# - Real-time metrics
# - Chart components
# - Date range selectors
# - Export functionality
```

## 🚀 Advanced Examples

### Custom Component Integration
```bash
# 1. Add your component to the manifest
# 2. Create a specification using your component
# 3. Generate and test

{
  "sections": [
    {
      "type": "YourCustomComponent",
      "inputs": {
        "customProp": "value"
      }
    }
  ]
}
```

### Multi-Page Application
```bash
# Generate multiple related pages
npm run ai:create:dashboard    # Main dashboard
npm run ai:create:listing      # Data management
npm run ai:create:form         # Data entry
npm run ai:create:settings     # Configuration

# Each page uses the same design system components
# Consistent navigation and styling automatically
```

### API Integration Examples
```json
{
  "type": "DataTableComponent",
  "inputs": {
    "dataSource": {
      "kind": "rest",
      "query": "/api/users",
      "variables": { "page": 1, "limit": 20 }
    }
  }
}
```

```json
{
  "type": "DataTableComponent",
  "inputs": {
    "dataSource": {
      "kind": "graphql",
      "query": "GET_PRODUCTS",
      "variables": { "category": "electronics" }
    }
  }
}
```

## 💡 Pro Tips

1. **Start with Templates**: Use `npm run ai:create` to explore available templates
2. **Iterate Quickly**: Use watch mode to see changes instantly
3. **Validate Early**: Run quality checks before finalizing specifications
4. **Customize Gradually**: Start with provided components, add custom ones as needed
5. **Document Patterns**: Save successful specifications as templates for your team

## 🎉 Success Patterns

- **Design System First**: Set up your manifest and tokens before generating
- **Template Library**: Build a collection of specifications for common patterns
- **Team Standards**: Share successful specifications across your development team
- **Continuous Integration**: Validate specifications in your CI/CD pipeline
- **Incremental Enhancement**: Start simple, add complexity as needed

**Ready to build amazing Angular applications with your design system? Pick any example above and start creating!** 🚀