
import fs from "node:fs";
import path from "node:path";
import manifest from "../../design-system/components.manifest.json" assert { type: "json" };

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
  return JSON.stringify(value, null, 0);
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
  function collect(n) {
    used.add(n.type);
    (n.children || []).forEach(collect);
  }
  (spec.sections || spec.children || []).forEach(collect);

  const imports = [...used].map(emitImport).join("\n");

  const body = (spec.sections || spec.children || [])
    .map(n => renderNode(n, 4))
    .join("\n\n");

  const code = `import React from "react";\n${imports}\n\nexport default function ${spec.page}() {\n  return (\n    <>\n${body}\n    </>\n  );\n}\n`;

  fs.mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${spec.page}.jsx`);
  fs.writeFileSync(file, code, "utf8");
  return file;
}
