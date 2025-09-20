
import fs from "node:fs";
import path from "node:path";
import { translate } from "./translate.mjs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { outDir: "src/pages", fromSpec: null, prompt: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--from-spec") opts.fromSpec = args[++i];
    else if (a === "--out") opts.outDir = args[++i];
    else if (a === "--prompt") opts.prompt = args[++i];
  }
  return opts;
}

function validateSpec(spec) {
  const ajv = new (await import("ajv")).default({ allErrors: true, strict: false });
  const schema = JSON.parse(fs.readFileSync(path.join(__dirname, "schema/ui-spec.schema.json"), "utf8"));
  const validate = ajv.compile(schema);
  const ok = validate(spec);
  if (!ok) {
    console.error("❌ Spec validation failed:");
    console.error(validate.errors);
    process.exit(1);
  }
}

async function main() {
  const { fromSpec, outDir, prompt } = parseArgs();

  let spec;

  if (fromSpec) {
    spec = JSON.parse(fs.readFileSync(fromSpec, "utf8"));
  } else if (prompt) {
    // Placeholder for LLM call: convert prompt -> spec.
    // You can wire your provider here (OpenAI, Azure, etc.).
    // For now we emit a tiny demo spec to prove the pipeline.
    console.warn("⚠️  --prompt mode is stubbed. Emitting a demo spec. Wire your LLM in run.mjs.");
    spec = {
      "page": "DemoPage",
      "route": "/demo",
      "sections": [
        { "type": "Card", "props": {"title": "Hello"}, "children": [
          { "type": "Button", "text": "Click me", "props": {"variant": "primary"} }
        ]}
      ]
    };
  } else {
    console.error("Usage: node scripts/ai-build/run.mjs --from-spec <spec.json> [--out src/pages]");
    console.error("   or: node scripts/ai-build/run.mjs --prompt <prompt.md>");
    process.exit(1);
  }

  // dynamic import for ajv inside ESM main
  const Ajv = (await import("ajv")).default;
  const ajv = new Ajv({ allErrors: true, strict: false });
  const schema = JSON.parse(fs.readFileSync(path.join(__dirname, "schema/ui-spec.schema.json"), "utf8"));
  const validate = ajv.compile(schema);
  const ok = validate(spec);
  if (!ok) {
    console.error("❌ Spec validation failed:");
    console.error(validate.errors);
    process.exit(1);
  }

  const outFile = translate(spec, outDir);
  console.log("✅ Generated:", outFile);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
