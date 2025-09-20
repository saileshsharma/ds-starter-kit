
import fs from "node:fs";
import path from "node:path";
import manifest from "../../design-system/components.manifest.json" with { type: "json" };

function emitImport(name) {
  const from = manifest[name]?.import;
  if (!from) throw new Error(`Unknown component: ${name}`);
  return `import { ${name} } from "${from}";`;
}

function serializeProp(value) {
  if (typeof value === "string") {
    // Heuristic: treat strings starting with "{{" as raw JS (e.g., {{state.expr}})
    if (value.startsWith("{{") && value.endsWith("}}")) {
      return value.slice(2, -2).trim();
    }
    return JSON.stringify(value);
  }

  // Handle data source objects
  if (typeof value === "object" && value !== null && value.kind) {
    return generateDataHook(value);
  }

  return JSON.stringify(value, null, 0);
}

function generateDataHook(dataSource) {
  const { kind, query, variables = {}, transform } = dataSource;

  switch (kind) {
    case "graphql":
      return `useGraphQLQuery("${query}", ${JSON.stringify(variables)})`;

    case "rest":
      return `useRestQuery("${query}", ${JSON.stringify(variables)})`;

    case "static":
      return JSON.stringify(dataSource.data || []);

    default:
      return `useQuery("${query}")`;
  }
}

function renderNode(node, indent = 2) {
  const pad = " ".repeat(indent);
  const { type, props = {}, children = [], text } = node;

  const propsStr = Object.entries(props)
    .map(([k, v]) => `${k}={${serializeProp(v)}}`)
    .join(" ");

  const hasChildren = children.length || text;
  const open = `<${type}${propsStr ? " " + propsStr : ""}${hasChildren ? ">" : " />"}`;

  if (!hasChildren) return pad + open;

  const inner = [
    text ? pad + "  " + (type === "Button" ? text : `{${JSON.stringify(text)}}`) : "",
    ...children.map(c => renderNode(c, indent + 2))
  ].filter(Boolean).join("\n");

  return `${pad}${open}\n${inner}\n${pad}</${type}>`;
}

export function translate(spec, outDir) {
  const used = new Set();
  const dataHooks = new Set();

  function collect(n) {
    used.add(n.type);

    // Check for data sources in props
    if (n.props) {
      for (const [key, value] of Object.entries(n.props)) {
        if (typeof value === "object" && value !== null && value.kind) {
          switch (value.kind) {
            case "graphql":
              dataHooks.add("useGraphQLQuery");
              break;
            case "rest":
              dataHooks.add("useRestQuery");
              break;
            default:
              dataHooks.add("useQuery");
          }
        }
      }
    }

    (n.children || []).forEach(collect);
  }

  (spec.sections || spec.children || []).forEach(collect);

  // Generate imports
  const componentImports = [...used].map(emitImport).join("\n");
  const dataImports = dataHooks.size > 0
    ? `import { ${[...dataHooks].join(", ")} } from "@your-ds/data";`
    : "";

  const allImports = [componentImports, dataImports].filter(Boolean).join("\n");

  // Generate component body
  const body = (spec.sections || spec.children || [])
    .map(n => renderNode(n, 4))
    .join("\n\n");

  // Generate page metadata if present
  const metaComments = spec.meta ? [
    `// Page: ${spec.page}`,
    spec.meta.title ? `// Title: ${spec.meta.title}` : "",
    spec.meta.description ? `// Description: ${spec.meta.description}` : "",
    spec.route ? `// Route: ${spec.route}` : ""
  ].filter(Boolean).join("\n") + "\n\n" : "";

  const code = `${metaComments}import React from "react";\n${allImports}\n\nexport default function ${spec.page}() {\n  return (\n    <>\n${body}\n    </>\n  );\n}\n`;

  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${spec.page}.jsx`);
  fs.writeFileSync(file, code, "utf8");
  return file;
}
