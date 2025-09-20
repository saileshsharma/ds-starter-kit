#!/usr/bin/env node

import fs from "node:fs";
import { QualityGates } from "./quality-gates.mjs";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: node scripts/ai-build/check-quality.mjs <spec.json>");
    process.exit(1);
  }

  const specPath = args[0];

  try {
    if (!fs.existsSync(specPath)) {
      console.error(`❌ File not found: ${specPath}`);
      process.exit(1);
    }

    const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
    const qualityGates = new QualityGates();

    console.log(`🔍 Running quality checks on: ${specPath}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const results = await qualityGates.validateSpec(spec);

    if (results.isValid && results.warnings.length === 0) {
      console.log("✅ All quality gates passed - no issues found!");
    } else {
      console.log(qualityGates.formatResults(results));
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (results.isValid) {
      console.log(`✅ Quality check completed: ${results.warnings.length} warnings`);
    } else {
      console.log(`❌ Quality check failed: ${results.errors.length} errors, ${results.warnings.length} warnings`);
      process.exit(1);
    }

  } catch (error) {
    console.error("❌ Quality check failed:", error.message);
    process.exit(1);
  }
}

main().catch(console.error);