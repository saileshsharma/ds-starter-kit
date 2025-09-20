
import fs from "node:fs";
import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true, strict: false });

const schema = JSON.parse(fs.readFileSync("scripts/ai-build/schema/ui-spec.schema.json", "utf8"));

function validateSpec(spec) {
  const validate = ajv.compile(schema);
  const ok = validate(spec);
  if (!ok) {
    console.error("❌ Spec validation failed:");
    console.error(validate.errors);
    process.exit(1);
  }
}

if (process.argv[2]) {
  const specPath = process.argv[2];
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  validateSpec(spec);
  console.log("✅ Spec is valid:", specPath);
} else {
  console.log("Usage: node scripts/ai-build/validate.mjs <path-to-spec.json>");
}
