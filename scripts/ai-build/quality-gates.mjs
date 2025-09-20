import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load design system manifest for validation
import manifest from "../../design-system/components.manifest.json" with { type: "json" };

export class QualityGates {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  // Main validation entry point
  async validateSpec(spec) {
    this.errors = [];
    this.warnings = [];

    this.validateComponentUsage(spec);
    this.validateProps(spec);
    this.validateAccessibility(spec);
    this.validateDataSources(spec);
    this.validateDesignTokens(spec);
    this.validateNamingConventions(spec);

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  // Validate generated code
  async validateGeneratedCode(filePath) {
    const codeErrors = [];
    const codeWarnings = [];

    try {
      const code = fs.readFileSync(filePath, "utf8");
      const isAngular = filePath.endsWith('.component.ts');
      const isReact = filePath.endsWith('.jsx') || filePath.endsWith('.tsx');

      if (isReact) {
        // React-specific validations
        if (!code.includes("import React")) {
          codeErrors.push("Missing React import");
        }

        if (!code.includes("export default function")) {
          codeErrors.push("Missing default export function");
        }

        // Check for proper prop passing
        const propPatterns = /(\w+)=\{(\w+)\}/g;
        let match;
        while ((match = propPatterns.exec(code)) !== null) {
          const [, propName, propValue] = match;
          if (propValue === "undefined") {
            codeErrors.push(`Undefined prop value for ${propName}`);
          }
        }
      }

      if (isAngular) {
        // Angular-specific validations
        if (!code.includes("import { Component }")) {
          codeErrors.push("Missing Angular Component import");
        }

        if (!code.includes("@Component")) {
          codeErrors.push("Missing @Component decorator");
        }

        if (!code.includes("export class")) {
          codeErrors.push("Missing component class export");
        }

        // Check for standalone component requirements
        if (!code.includes("standalone: true")) {
          codeWarnings.push("Consider using standalone components for better modularity");
        }

        // Check for imports array
        if (!code.includes("imports:")) {
          codeWarnings.push("Standalone components should declare their imports");
        }
      }

      // Common accessibility checks
      if (code.includes("<button") && !code.includes('aria-')) {
        codeWarnings.push("Buttons should include accessibility attributes");
      }

    } catch (error) {
      codeErrors.push(`Code validation failed: ${error.message}`);
    }

    return {
      isValid: codeErrors.length === 0,
      errors: codeErrors,
      warnings: codeWarnings
    };
  }

  // Check if only manifest components are used
  validateComponentUsage(spec) {
    const checkNode = (node) => {
      if (!node.type) return;

      if (!manifest[node.type]) {
        this.errors.push(`Unknown component: ${node.type}. Must use components from manifest.`);
      }

      if (node.children) {
        node.children.forEach(checkNode);
      }
    };

    if (spec.sections) {
      spec.sections.forEach(checkNode);
    }
    if (spec.children) {
      spec.children.forEach(checkNode);
    }
  }

  // Validate component props against manifest
  validateProps(spec) {
    const checkNode = (node) => {
      if (!node.type || !manifest[node.type]) return;

      const componentDef = manifest[node.type];
      const nodeProps = node.props || {};

      // Check required props
      if (componentDef.props) {
        for (const [propName, propDef] of Object.entries(componentDef.props)) {
          if (propDef.required && !(propName in nodeProps)) {
            this.errors.push(`Missing required prop "${propName}" for component ${node.type}`);
          }

          // Validate prop types
          if (propName in nodeProps) {
            this.validatePropType(node.type, propName, nodeProps[propName], propDef);
          }
        }
      }

      if (node.children) {
        node.children.forEach(checkNode);
      }
    };

    if (spec.sections) {
      spec.sections.forEach(checkNode);
    }
    if (spec.children) {
      spec.children.forEach(checkNode);
    }
  }

  // Validate individual prop types
  validatePropType(componentType, propName, propValue, propDef) {
    if (propDef.type === "enum" && propDef.values) {
      if (!propDef.values.includes(propValue)) {
        this.errors.push(
          `Invalid value "${propValue}" for ${componentType}.${propName}. ` +
          `Must be one of: ${propDef.values.join(", ")}`
        );
      }
    }

    if (propDef.type === "number") {
      if (typeof propValue !== "number") {
        this.errors.push(`${componentType}.${propName} must be a number, got ${typeof propValue}`);
      }
      if (propDef.min !== undefined && propValue < propDef.min) {
        this.errors.push(`${componentType}.${propName} must be >= ${propDef.min}`);
      }
      if (propDef.max !== undefined && propValue > propDef.max) {
        this.errors.push(`${componentType}.${propName} must be <= ${propDef.max}`);
      }
    }

    if (propDef.type === "boolean" && typeof propValue !== "boolean") {
      this.errors.push(`${componentType}.${propName} must be a boolean, got ${typeof propValue}`);
    }
  }

  // Check for accessibility best practices
  validateAccessibility(spec) {
    const checkNode = (node) => {
      // Check for form inputs without labels
      if (node.type === "Input" && !node.props?.label && !node.props?.["aria-label"]) {
        this.warnings.push(`Input component should have a label or aria-label`);
      }

      // Check for buttons without proper text
      if (node.type === "Button" && !node.text && !node.props?.["aria-label"]) {
        this.warnings.push(`Button component should have text or aria-label`);
      }

      // Check for images without alt text
      if (node.type === "Image" && !node.props?.alt) {
        this.warnings.push(`Image component should have alt text`);
      }

      // Check for tables without proper headers
      if (node.type === "DataTable" && (!node.props?.columns || !Array.isArray(node.props.columns))) {
        this.errors.push(`DataTable must have columns array defined`);
      }

      if (node.children) {
        node.children.forEach(checkNode);
      }
    };

    if (spec.sections) {
      spec.sections.forEach(checkNode);
    }
    if (spec.children) {
      spec.children.forEach(checkNode);
    }
  }

  // Validate data source configurations
  validateDataSources(spec) {
    const checkNode = (node) => {
      if (node.props?.dataSource) {
        const ds = node.props.dataSource;

        if (!ds.kind || !["graphql", "rest", "static"].includes(ds.kind)) {
          this.errors.push(`Invalid dataSource.kind: ${ds.kind}. Must be graphql, rest, or static`);
        }

        if ((ds.kind === "graphql" || ds.kind === "rest") && !ds.query) {
          this.errors.push(`dataSource of type ${ds.kind} requires a query field`);
        }
      }

      if (node.children) {
        node.children.forEach(checkNode);
      }
    };

    if (spec.sections) {
      spec.sections.forEach(checkNode);
    }
    if (spec.children) {
      spec.children.forEach(checkNode);
    }
  }

  // Validate design token usage
  validateDesignTokens(spec) {
    const validTokenPatterns = [
      /^spacing\.[1-9][0-9]*$/,
      /^colors?\.(brand|success|warning|error|text|background|border)\.(primary|secondary)?$/,
      /^typography\.(font|size)\.(xs|sm|md|lg|xl|2xl|body|heading|mono)$/,
      /^radius\.(sm|md|lg|xl)$/,
      /^shadows?\.(sm|md|lg)$/
    ];

    const checkTokenUsage = (obj, path = "") => {
      if (typeof obj === "string") {
        // Check if string looks like a design token but doesn't match patterns
        if (obj.includes(".") && (obj.startsWith("spacing") || obj.startsWith("color") || obj.startsWith("typography"))) {
          const isValid = validTokenPatterns.some(pattern => pattern.test(obj));
          if (!isValid) {
            this.warnings.push(`Potentially invalid design token: "${obj}" at ${path}`);
          }
        }
      } else if (typeof obj === "object" && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          checkTokenUsage(value, path ? `${path}.${key}` : key);
        }
      }
    };

    checkTokenUsage(spec);
  }

  // Validate naming conventions
  validateNamingConventions(spec) {
    // Check page name (PascalCase)
    if (spec.page && !/^[A-Z][A-Za-z0-9]*$/.test(spec.page)) {
      this.errors.push(`Page name "${spec.page}" must be in PascalCase`);
    }

    // Check route (starts with /)
    if (spec.route && !spec.route.startsWith("/")) {
      this.errors.push(`Route "${spec.route}" must start with /`);
    }

    // Check component IDs (camelCase)
    const checkIds = (node) => {
      if (node.id && !/^[a-z][a-zA-Z0-9]*$/.test(node.id)) {
        this.warnings.push(`Component ID "${node.id}" should be in camelCase`);
      }

      if (node.children) {
        node.children.forEach(checkIds);
      }
    };

    if (spec.sections) {
      spec.sections.forEach(checkIds);
    }
    if (spec.children) {
      spec.children.forEach(checkIds);
    }
  }

  // Format validation results
  formatResults(results) {
    let output = "";

    if (results.errors.length > 0) {
      output += "❌ Errors:\n";
      results.errors.forEach(error => {
        output += `  • ${error}\n`;
      });
    }

    if (results.warnings.length > 0) {
      output += "⚠️  Warnings:\n";
      results.warnings.forEach(warning => {
        output += `  • ${warning}\n`;
      });
    }

    if (results.isValid) {
      output += "✅ All quality gates passed\n";
    }

    return output;
  }
}

export default QualityGates;