# AI Builder Starter (Angular Design System)

A comprehensive toolkit for AI-assisted UI development that converts structured specifications into **Angular** components using your design system.

![AI Builder Architecture](https://img.shields.io/badge/AI%20Builder-Angular--Only-red?style=for-the-badge)
![Angular Support](https://img.shields.io/badge/Angular-17+-DD0031?style=flat-square&logo=angular)

## ✨ Features

- 🤖 **AI-Powered Generation**: Convert natural language requirements to Angular components
- 🅰️ **Angular Focus**: Generate standalone components with Reactive Forms and services
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

# 3) Try the Angular demo
npm run ai:demo
# ✅ Generates: src/pages/claimsdashboard.component.ts

# 4) Test AI generation (with API key)
OPENAI_API_KEY=sk-xxx npm run ai:build -- --prompt prompts/angular-user-profile.md
```

## 📋 Available Commands

```bash
# Core commands
npm run ai:build              # Build from spec or prompt
npm run ai:validate           # Validate spec against schema
npm run ai:quality            # Run quality gates on spec

# Angular demos
npm run ai:demo               # Generate Angular dashboard
npm run ai:demo:watch         # Watch Angular spec for changes

# Development
npm run format                # Format code with Prettier
npm run lint                 # Run linting (configure as needed)
```

## 🛠️ CLI Usage

### Generate from Specification

```bash
# Angular generation
node scripts/ai-build/run.mjs --from-spec examples/angular-claims-dashboard.spec.json

# With formatting and custom output
node scripts/ai-build/run.mjs \
  --from-spec examples/angular-claims-dashboard.spec.json \
  --out src/components \
  --format

# Watch mode for development
node scripts/ai-build/run.mjs \
  --from-spec examples/angular-claims-dashboard.spec.json \
  --watch
```

### Generate from AI Prompts

```bash
# Angular generation with OpenAI GPT
OPENAI_API_KEY=sk-xxx node scripts/ai-build/run.mjs \
  --prompt prompts/angular-user-profile.md

# Angular generation with Anthropic Claude
ANTHROPIC_API_KEY=xxx node scripts/ai-build/run.mjs \
  --prompt prompts/angular-user-profile.md \
  --provider claude

# Using local Ollama for Angular
node scripts/ai-build/run.mjs \
  --prompt prompts/angular-user-profile.md \
  --provider ollama \
  --model llama3.1

# Angular with custom AI settings
node scripts/ai-build/run.mjs \
  --prompt prompts/angular-user-profile.md \
  --provider openai \
  --model gpt-4 \
  --temperature 0.2 \
  --max-tokens 3000
```

### Quality Assurance

```bash
# Validate JSON schema
node scripts/ai-build/validate.mjs examples/angular-claims-dashboard.spec.json

# Run comprehensive quality checks
npm run ai:quality examples/angular-claims-dashboard.spec.json

# Generate with all quality gates
node scripts/ai-build/run.mjs \
  --from-spec examples/angular-claims-dashboard.spec.json \
  --format \
  --validate
```

## 🏗️ Architecture

### Design System Contract

The AI Builder enforces your design system through three key files:

1. **`design-system/tokens.json`** - Design tokens (colors, spacing, typography)
2. **`design-system/components.manifest.json`** - Available Angular components and their inputs
3. **`scripts/ai-build/schema/ui-spec.schema.json`** - JSON schema for specifications

### Data Integration

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
4. **Code Generation** → Translates spec to Angular components
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
  "ButtonComponent": {
    "selector": "app-button",
    "module": "@your-company/angular-design-system",
    "description": "Interactive button component",
    "inputs": {
      "variant": {
        "type": "enum",
        "values": ["primary", "secondary", "outline"]
      }
    },
    "outputs": {
      "click": { "type": "event" }
    },
    "template": "standalone"
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

3. **Update Import Sources** in the manifest to point to your actual Angular design system package.

### Data Layer Integration

Create data services in your project:

```typescript
// src/services/data.service.ts
@Injectable()
export class GraphQLService {
  query(queryName: string, variables: any): Observable<any> {
    // Your GraphQL implementation
  }
}
```

Update the translator import path in `scripts/ai-build/angular-translate.mjs`.

## 📖 Examples

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

### AI Prompt Example

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
- **Input Validation**: Type and enum value checking
- **Accessibility**: WCAG compliance hints
- **Design Tokens**: Token usage validation
- **Naming Conventions**: Component and input naming
- **Data Sources**: Data integration validation
- **Code Quality**: Generated code validation

## 🤝 Integration Guide

### With Existing Angular Projects

1. **Copy the AI Builder** into your project root
2. **Update manifest** to reference your Angular design system components
3. **Configure data services** to use your data layer
4. **Set up CI/CD** to run quality gates
5. **Train your team** on prompt engineering

### With Popular Angular Libraries

- **Angular Material**: Update imports to `@angular/material`
- **PrimeNG**: Update imports to `primeng`
- **Ng-Zorro**: Update imports to `ng-zorro-antd`
- **Nebular**: Update imports to `@nebular/theme`

## 🔮 Advanced Usage

### Custom Component Types

Extend the schema and manifest to support custom Angular components:

```json
{
  "CustomChartComponent": {
    "selector": "app-custom-chart",
    "module": "@your-company/charts",
    "inputs": {
      "chartType": {
        "type": "enum",
        "values": ["line", "bar", "pie"]
      }
    },
    "template": "standalone"
  }
}
```

### Event Handling

Add event handlers to generated components:

```json
{
  "type": "ButtonComponent",
  "inputs": { "variant": "primary" },
  "text": "Save",
  "outputs": {
    "click": "handleSave"
  }
}
```

### Custom Data Transformations

Implement data transformations in your Angular services:

```typescript
@Injectable()
export class GraphQLService {
  query(query: string, variables: any, transform?: (data: any) => any): Observable<any> {
    return this.apollo.query({ query, variables }).pipe(
      map(result => transform ? transform(result.data) : result.data)
    );
  }
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
3. **Component Library**: Deploy your Angular design system package
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

- **Prompt Engineering**: See `prompts/` directory for Angular examples
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

**Built with ❤️ for Angular design system-aware AI development**