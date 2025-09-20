
# AI Builder Starter (Design System–aware)

A comprehensive toolkit for AI-assisted UI development that converts structured specifications into **React** or **Angular** components using your design system.

![AI Builder Architecture](https://img.shields.io/badge/AI%20Builder-Multi--Framework-blue?style=for-the-badge)
![React Support](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)
![Angular Support](https://img.shields.io/badge/Angular-17+-DD0031?style=flat-square&logo=angular)

## ✨ Features

- 🤖 **AI-Powered Generation**: Convert natural language requirements to React or Angular components
- ⚛️ **React Support**: Generate JSX components with hooks and modern patterns
- 🅰️ **Angular Support**: Generate standalone components with Reactive Forms and services
- 🎨 **Design System Integration**: Enforce component and token usage from your design system
- 🔒 **Quality Gates**: Comprehensive validation, accessibility checks, and code quality
- 📊 **Data-Aware**: Built-in support for GraphQL, REST, and static data sources
- 🛡️ **Type Safety**: JSON Schema validation with manifest-driven component imports
- 🔄 **Watch Mode**: Real-time regeneration during development
- 🎯 **Multi-Provider AI**: OpenAI GPT, Anthropic Claude, and local Ollama support

## 🚀 Quick Start

```bash
# 1) Clone or copy into your project
cp -R ai-builder-starter/* .

# 2) Install dependencies
npm install

# 3) Try the React demo
npm run ai:demo
# ✅ Generates: src/pages/ClaimsDashboard.jsx

# 4) Try the Angular demo
npm run ai:demo:angular
# ✅ Generates: src/pages/claimsdashboard.component.ts

# 5) Test AI generation (with API key)
OPENAI_API_KEY=sk-xxx npm run ai:build -- --prompt prompts/claims-dashboard.md --framework react
OPENAI_API_KEY=sk-xxx npm run ai:build -- --prompt prompts/angular-user-profile.md --framework angular
```

## 📋 Available Commands

```bash
# Core commands
npm run ai:build              # Build from spec or prompt
npm run ai:validate           # Validate spec against schema
npm run ai:quality            # Run quality gates on spec

# React demos
npm run ai:demo               # Generate React dashboard
npm run ai:demo:watch         # Watch React spec for changes
npm run ai:build:react        # Build React components

# Angular demos
npm run ai:demo:angular       # Generate Angular dashboard
npm run ai:demo:angular:watch # Watch Angular spec for changes
npm run ai:build:angular      # Build Angular components

# Development
npm run format                # Format code with Prettier
npm run lint                 # Run linting (configure as needed)
```

## 🛠️ CLI Usage

### Generate from Specification

```bash
# React generation
node scripts/ai-build/run.mjs --from-spec examples/claims-dashboard.spec.json --framework react

# Angular generation
node scripts/ai-build/run.mjs --from-spec examples/angular-claims-dashboard.spec.json --framework angular

# With formatting and custom output
node scripts/ai-build/run.mjs \
  --from-spec examples/enhanced-dashboard.spec.json \
  --framework react \
  --out src/components \
  --format

# Watch mode for development
node scripts/ai-build/run.mjs \
  --from-spec examples/angular-claims-dashboard.spec.json \
  --framework angular \
  --watch
```

### Generate from AI Prompts

```bash
# React generation with OpenAI GPT
OPENAI_API_KEY=sk-xxx node scripts/ai-build/run.mjs \
  --prompt prompts/user-profile.md \
  --framework react

# Angular generation with Anthropic Claude
ANTHROPIC_API_KEY=xxx node scripts/ai-build/run.mjs \
  --prompt prompts/angular-user-profile.md \
  --framework angular \
  --provider claude

# Using local Ollama for React
node scripts/ai-build/run.mjs \
  --prompt prompts/claims-dashboard.md \
  --framework react \
  --provider ollama \
  --model llama3.1

# Angular with custom AI settings
node scripts/ai-build/run.mjs \
  --prompt prompts/angular-user-profile.md \
  --framework angular \
  --provider openai \
  --model gpt-4 \
  --temperature 0.2 \
  --max-tokens 3000
```

### Quality Assurance

```bash
# Validate JSON schema
node scripts/ai-build/validate.mjs examples/dashboard.spec.json

# Run comprehensive quality checks
npm run ai:quality examples/enhanced-dashboard.spec.json

# Generate with all quality gates
node scripts/ai-build/run.mjs \
  --from-spec examples/dashboard.spec.json \
  --format \
  --validate
```

## 🏗️ Architecture

### Design System Contract

The AI Builder enforces your design system through three key files:

1. **`design-system/tokens.json`** - Design tokens (colors, spacing, typography)
2. **`design-system/components.manifest.json`** - Available components and their props
3. **`scripts/ai-build/schema/ui-spec.schema.json`** - JSON schema for specifications

### Data Integration

#### React Components
Components automatically generate data hooks based on `dataSource` configuration:

```json
{
  "type": "DataTable",
  "props": {
    "dataSource": {
      "kind": "graphql",
      "query": "GET_USERS",
      "variables": { "limit": 10 }
    }
  }
}
```

Generates:

```jsx
<DataTable dataSource={useGraphQLQuery("GET_USERS", { limit: 10 })} />
```

#### Angular Components
Angular components use services and observables for data integration:

```json
{
  "type": "DataTableComponent",
  "inputs": {
    "dataSource": {
      "kind": "graphql",
      "query": "GET_USERS",
      "variables": { "limit": 10 }
    }
  }
}
```

Generates:

```html
<app-data-table [dataSource]="graphqlService.query('GET_USERS', {limit: 10})"></app-data-table>
```

### AI Pipeline

1. **Prompt Processing** → AI generates JSON specification
2. **Schema Validation** → Ensures spec follows structure
3. **Quality Gates** → Component usage, accessibility, design tokens
4. **Code Generation** → Translates spec to React JSX
5. **Code Validation** → Checks generated code quality
6. **Formatting** → Prettier formatting (optional)

## 🔧 Configuration

### Environment Variables

```bash
# AI Providers
OPENAI_API_KEY=sk-xxx        # OpenAI GPT models
ANTHROPIC_API_KEY=xxx        # Anthropic Claude models
AI_PROVIDER=openai           # Default provider: openai|claude|ollama

# Development
NODE_ENV=development
```

### Design System Setup

1. **Update Component Manifest** (`design-system/components.manifest.json`):

```json
{
  "Button": {
    "import": "@your-company/design-system",
    "description": "Interactive button component",
    "props": {
      "variant": {
        "type": "enum",
        "values": ["primary", "secondary", "outline"]
      }
    }
  }
}
```

2. **Configure Design Tokens** (`design-system/tokens.json`):

```json
{
  "colors": {
    "brand.primary": "#your-brand-color"
  },
  "spacing": {
    "4": "16px"
  }
}
```

3. **Update Import Sources** in the manifest to point to your actual design system package.

### Data Layer Integration

Create data hooks in your project:

```javascript
// src/hooks/data.js
export { useGraphQLQuery, useRestQuery } from './path/to/your/data/layer';
```

Update the translator import path in `scripts/ai-build/translate.mjs`.

## 📖 Examples

### React Dashboard Spec

```json
{
  "page": "Dashboard",
  "route": "/dashboard",
  "layout": { "type": "Grid", "cols": 12, "gap": "spacing.4" },
  "sections": [
    {
      "type": "Card",
      "gridArea": { "from": 1, "to": 8 },
      "props": { "title": "Analytics" },
      "children": [
        {
          "type": "DataTable",
          "props": {
            "columns": [
              { "key": "name", "header": "Name" },
              { "key": "value", "header": "Value" }
            ],
            "dataSource": {
              "kind": "rest",
              "query": "/api/analytics"
            }
          }
        }
      ]
    }
  ]
}
```

### Angular Dashboard Spec

```json
{
  "page": "Dashboard",
  "route": "/dashboard",
  "layout": { "type": "GridComponent", "cols": 12, "gap": "spacing.4" },
  "sections": [
    {
      "type": "CardComponent",
      "gridArea": { "from": 1, "to": 8 },
      "inputs": { "title": "Analytics" },
      "children": [
        {
          "type": "DataTableComponent",
          "inputs": {
            "columns": [
              { "key": "name", "header": "Name" },
              { "key": "value", "header": "Value" }
            ],
            "dataSource": {
              "kind": "rest",
              "query": "/api/analytics"
            }
          },
          "outputs": {
            "rowClick": "onRowClick"
          }
        }
      ]
    }
  ]
}
```

### Framework Differences

| Feature | React | Angular |
|---------|-------|---------|
| Component Names | `Card`, `Button` | `CardComponent`, `ButtonComponent` |
| Properties | `props: {}` | `inputs: {}` |
| Events | Inline handlers | `outputs: {}` |
| Forms | React hooks | `FormGroup`, `FormControl` |
| Data | Custom hooks | Services + Observables |
| File Extension | `.jsx`, `.tsx` | `.component.ts` |

### AI Prompt Examples

#### React Prompt
```markdown
# React User Profile Page

Create a React user profile page with:
- User information card (name, email, avatar)
- Editable form with React hooks
- Account settings toggles
- Activity statistics

Use a Stack layout with Cards for each section.
Include proper form validation and loading states.
```

#### Angular Prompt
```markdown
# Angular User Profile Page

Create an Angular user profile page with:
- User information card (name, email, avatar)
- Reactive form with FormGroup and FormControl
- Account settings with two-way binding
- Activity statistics

Use StackComponent layout with CardComponents.
Include form validation and Angular services for data.
```

## 🔍 Quality Gates

The AI Builder includes comprehensive quality assurance:

- **Schema Validation**: JSON structure validation
- **Component Validation**: Manifest compliance checking
- **Prop Validation**: Type and enum value checking
- **Accessibility**: WCAG compliance hints
- **Design Tokens**: Token usage validation
- **Naming Conventions**: Component and prop naming
- **Data Sources**: Data integration validation
- **Code Quality**: Generated code validation

## 🤝 Integration Guide

### With Existing Projects

1. **Copy the AI Builder** into your project root
2. **Update manifest** to reference your design system components
3. **Configure data hooks** to use your data layer
4. **Set up CI/CD** to run quality gates
5. **Train your team** on prompt engineering

### With Popular Frameworks

- **Next.js**: Place generated components in `pages/` or `app/`
- **Vite/Create React App**: Use `src/pages/` or `src/components/`
- **Storybook**: Generate story files alongside components
- **Testing**: Add generated component tests to your test suite

## 🔮 Advanced Usage

### Custom Component Types

Extend the schema and manifest to support custom components:

```json
{
  "CustomChart": {
    "import": "@your-company/charts",
    "props": {
      "chartType": {
        "type": "enum",
        "values": ["line", "bar", "pie"]
      }
    }
  }
}
```

### Event Handling

Add event handlers to generated components:

```json
{
  "type": "Button",
  "props": { "variant": "primary" },
  "text": "Save",
  "events": {
    "onClick": "handleSave"
  }
}
```

### Custom Data Transformations

Implement data transformations in your data hooks:

```javascript
export function useGraphQLQuery(query, variables, transform) {
  const { data, loading, error } = useQuery(query, variables);

  return {
    data: transform ? transform(data) : data,
    loading,
    error
  };
}
```

## 🛡️ Security Considerations

- **API Keys**: Store securely, never commit to version control
- **Component Validation**: Only allow manifest-defined components
- **Data Sources**: Validate and sanitize all data endpoints
- **Generated Code**: Review AI-generated code before deployment
- **Access Control**: Implement proper authentication for data sources

## 🚀 Deployment

### Production Setup

1. **Environment Variables**: Configure for production
2. **Data Endpoints**: Ensure production APIs are accessible
3. **Component Library**: Deploy your design system package
4. **Quality Gates**: Run in CI/CD pipeline
5. **Monitoring**: Set up error tracking for generated components

### CI/CD Integration

```yaml
# .github/workflows/ai-builder.yml
name: AI Builder Quality Gates
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run ai:validate examples/*.spec.json
      - run: npm run ai:quality examples/*.spec.json
```

## 📚 Learning Resources

- **Prompt Engineering**: See `prompts/` directory for examples
- **Component Design**: Study `examples/` specifications
- **Schema Reference**: Check `scripts/ai-build/schema/ui-spec.schema.json`
- **Quality Gates**: Review `scripts/ai-build/quality-gates.mjs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Run quality gates: `npm run ai:quality`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙋‍♂️ Support

- **Documentation**: Check this README and inline comments
- **Examples**: See `examples/` and `prompts/` directories
- **Issues**: Report bugs and feature requests on GitHub
- **Community**: Join discussions in GitHub Discussions

---

**Built with ❤️ for design system-aware AI development**
