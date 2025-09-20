import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load design system manifest for Angular validation
import manifest from "../../design-system/components.manifest.json" with { type: "json" };

function emitImport(componentName) {
  const componentDef = manifest[componentName];
  if (!componentDef) throw new Error(`Unknown component: ${componentName}`);

  const selector = componentDef.selector.replace('app-', '');
  return {
    import: `import { ${componentName} } from "${componentDef.module}";`,
    selector: componentDef.selector
  };
}

function serializeInput(key, value) {
  if (typeof value === "string") {
    // Handle Angular template expressions
    if (value.startsWith("{{") && value.endsWith("}}")) {
      return `[${key}]="${value.slice(2, -2).trim()}"`;
    }
    return `${key}="${value}"`;
  }

  // Handle data source objects for Angular services
  if (typeof value === "object" && value !== null && value.kind) {
    return `[${key}]="${generateDataService(value)}"`;
  }

  if (typeof value === "boolean") {
    return value ? `[${key}]="true"` : `[${key}]="false"`;
  }

  if (typeof value === "number") {
    return `[${key}]="${value}"`;
  }

  if (Array.isArray(value)) {
    return `[${key}]='${JSON.stringify(value)}'`;
  }

  return `[${key}]='${JSON.stringify(value)}'`;
}

function generateDataService(dataSource) {
  const { kind, query, variables = {} } = dataSource;

  switch (kind) {
    case "graphql":
      return `graphqlService.query('${query}', ${JSON.stringify(variables)})`;

    case "rest":
      return `httpService.get('${query}', ${JSON.stringify(variables)})`;

    case "static":
      return `of(${JSON.stringify(dataSource.data || [])})`;

    default:
      return `dataService.query('${query}')`;
  }
}

function serializeOutput(key, value) {
  return `(${key})="${value}"`;
}

function renderAngularNode(node, indent = 2) {
  const pad = " ".repeat(indent);
  const { type, inputs = {}, outputs = {}, children = [], text, events = {} } = node;

  // Convert React-style props to Angular inputs
  const angularInputs = node.props || inputs;
  const angularOutputs = { ...outputs, ...events };

  const componentDef = manifest[type];
  if (!componentDef) {
    throw new Error(`Unknown component type: ${type}`);
  }

  const selector = componentDef.selector;

  // Generate input bindings
  const inputBindings = Object.entries(angularInputs)
    .map(([key, value]) => serializeInput(key, value))
    .join(" ");

  // Generate output bindings
  const outputBindings = Object.entries(angularOutputs)
    .map(([key, value]) => serializeOutput(key, value))
    .join(" ");

  const allBindings = [inputBindings, outputBindings].filter(Boolean).join(" ");
  const hasChildren = children.length > 0 || text;

  const openTag = `<${selector}${allBindings ? " " + allBindings : ""}${hasChildren ? ">" : " />"}`;

  if (!hasChildren) {
    return pad + openTag;
  }

  // Handle text content
  const textContent = text ? pad + "  " + text : "";

  // Handle child components
  const childContent = children
    .map(child => renderAngularNode(child, indent + 2))
    .join("\n");

  const content = [textContent, childContent].filter(Boolean).join("\n");
  const closeTag = `</${selector}>`;

  return `${pad}${openTag}\n${content}\n${pad}${closeTag}`;
}

function generateAngularComponent(spec, outDir) {
  const used = new Set();
  const services = new Set();

  function collect(n) {
    used.add(n.type);

    // Check for data sources in inputs/props
    const inputs = n.inputs || n.props || {};
    for (const [key, value] of Object.entries(inputs)) {
      if (typeof value === "object" && value !== null && value.kind) {
        switch (value.kind) {
          case "graphql":
            services.add("GraphQLService");
            break;
          case "rest":
            services.add("HttpClient");
            break;
          default:
            services.add("DataService");
        }
      }
    }

    (n.children || []).forEach(collect);
  }

  (spec.sections || spec.children || []).forEach(collect);

  // Generate imports
  const componentImports = [...used].map(emitImport);
  const componentImportStatements = componentImports.map(c => c.import).join("\n");

  const serviceImports = services.size > 0
    ? `import { ${[...services].join(", ")} } from "@your-ds/angular/services";`
    : "";

  const coreImports = [
    "import { Component } from '@angular/core';",
    "import { CommonModule } from '@angular/common';"
  ].join("\n");

  const allImports = [coreImports, componentImportStatements, serviceImports]
    .filter(Boolean)
    .join("\n");

  // Generate template
  const template = (spec.sections || spec.children || [])
    .map(n => renderAngularNode(n, 2))
    .join("\n\n");

  // Generate component class
  const className = `${spec.page}Component`;
  const selector = `app-${spec.page.toLowerCase().replace(/([A-Z])/g, '-$1').slice(1)}`;

  // Generate page metadata comments
  const metaComments = spec.meta ? [
    `// Page: ${spec.page}`,
    spec.meta.title ? `// Title: ${spec.meta.title}` : "",
    spec.meta.description ? `// Description: ${spec.meta.description}` : "",
    spec.route ? `// Route: ${spec.route}` : ""
  ].filter(Boolean).join("\n") + "\n\n" : "";

  // Generate service injections
  const serviceInjections = [...services].map(service => {
    const serviceName = service.replace(/([A-Z])/g, (match, letter, index) =>
      index === 0 ? letter.toLowerCase() : letter.toLowerCase()
    ).replace(/service$/, 'Service');
    return `  private ${serviceName}: ${service}`;
  }).join(",\n");

  const constructor = services.size > 0
    ? `\n  constructor(\n${serviceInjections}\n  ) {}`
    : "";

  // Generate component imports for standalone
  const standaloneImports = componentImports
    .map(c => c.import.match(/import\s+{\s*([^}]+)\s*}/)?.[1])
    .filter(Boolean)
    .concat(['CommonModule']);

  const code = `${metaComments}${allImports}

@Component({
  selector: '${selector}',
  standalone: true,
  imports: [${standaloneImports.join(', ')}],
  template: \`
${template}
  \`
})
export class ${className} {${constructor}
}
`;

  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${spec.page.toLowerCase()}.component.ts`);
  fs.writeFileSync(file, code, "utf8");
  return file;
}

export { generateAngularComponent as translate };
export default generateAngularComponent;