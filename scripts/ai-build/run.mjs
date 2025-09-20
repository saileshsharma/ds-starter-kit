
import fs from "node:fs";
import path from "node:path";
import { translate as angularTranslate } from "./angular-translate.mjs";
import { QualityGates } from "./quality-gates.mjs";
import { LLMProviders } from "./llm-providers.mjs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    outDir: "src/pages",
    fromSpec: null,
    prompt: null,
    validate: true,
    format: false,
    watch: false,
    provider: null,
    model: null,
    temperature: null,
    maxTokens: null,
    useAI: false,
    framework: "angular"
  };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--from-spec") opts.fromSpec = args[++i];
    else if (a === "--out") opts.outDir = args[++i];
    else if (a === "--prompt") opts.prompt = args[++i];
    else if (a === "--no-validate") opts.validate = false;
    else if (a === "--format") opts.format = true;
    else if (a === "--watch") opts.watch = true;
    else if (a === "--provider") opts.provider = args[++i];
    else if (a === "--model") opts.model = args[++i];
    else if (a === "--temperature") opts.temperature = parseFloat(args[++i]);
    else if (a === "--max-tokens") opts.maxTokens = parseInt(args[++i]);
    else if (a === "--use-ai") opts.useAI = true;
    else if (a === "--framework") opts.framework = args[++i];
    else if (a === "--help" || a === "-h") {
      console.log(`
AI Builder CLI - Generate components from UI specifications

Usage:
  node scripts/ai-build/run.mjs [options]

Options:
  --from-spec <file>    Generate from existing spec JSON file
  --prompt <file>       Generate from markdown prompt (uses AI if configured)
  --out <dir>           Output directory (default: src/pages)
  --framework <name>    Target framework: angular (default: angular)
  --no-validate         Skip JSON schema validation
  --format              Format generated code with Prettier
  --watch               Watch spec file for changes and regenerate
  --provider <name>     AI provider: openai, claude, ollama (auto-detect if not specified)
  --model <name>        AI model to use (provider-specific)
  --temperature <num>   AI creativity (0.0-1.0, default: 0.1)
  --max-tokens <num>    Maximum tokens for AI response (default: 2000)
  --use-ai              Force AI usage even without API keys (for testing)
  --help, -h            Show this help message

Environment Variables:
  OPENAI_API_KEY        OpenAI API key for GPT models
  ANTHROPIC_API_KEY     Anthropic API key for Claude models
  AI_PROVIDER           Default AI provider (openai, claude, ollama)

Examples:
  # Generate from spec file
  node scripts/ai-build/run.mjs --from-spec examples/dashboard.spec.json

  # Generate from prompt with OpenAI
  OPENAI_API_KEY=sk-... node scripts/ai-build/run.mjs --prompt prompts/dashboard.md

  # Generate with specific model and settings
  node scripts/ai-build/run.mjs --prompt prompts/dashboard.md --provider openai --model gpt-4 --temperature 0.2

  # Generate with local Ollama
  node scripts/ai-build/run.mjs --prompt prompts/dashboard.md --provider ollama --model llama3.1
      `);
      process.exit(0);
    }
  }
  return opts;
}

async function validateSpec(spec) {
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
}

async function generateFromSpec(specPath, opts) {
  try {
    const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));

    // JSON Schema validation
    if (opts.validate) {
      await validateSpec(spec);
    }

    // Quality gates validation
    const qualityGates = new QualityGates();
    const qualityResults = await qualityGates.validateSpec(spec);

    if (!qualityResults.isValid) {
      console.error("❌ Quality gates failed:");
      console.error(qualityGates.formatResults(qualityResults));
      process.exit(1);
    }

    if (qualityResults.warnings.length > 0) {
      console.warn("⚠️ Quality warnings:");
      console.warn(qualityGates.formatResults(qualityResults));
    }

    // Generate Angular code
    const outFile = angularTranslate(spec, opts.outDir);

    // Validate generated code
    const codeResults = await qualityGates.validateGeneratedCode(outFile);
    if (!codeResults.isValid) {
      console.error("❌ Generated code validation failed:");
      console.error(qualityGates.formatResults(codeResults));
    }

    if (codeResults.warnings.length > 0) {
      console.warn("⚠️ Generated code warnings:");
      console.warn(qualityGates.formatResults(codeResults));
    }

    // Format code
    if (opts.format) {
      await formatCode(outFile);
    }

    console.log("✅ Generated:", outFile);
    return outFile;
  } catch (error) {
    console.error("❌ Generation failed:", error.message);
    process.exit(1);
  }
}

async function generateFromPrompt(promptPath, opts) {
  try {
    console.log("📝 Reading prompt:", promptPath);

    if (!fs.existsSync(promptPath)) {
      throw new Error(`Prompt file not found: ${promptPath}`);
    }

    const promptContent = fs.readFileSync(promptPath, "utf8");
    console.log("🤖 Converting prompt to spec with AI...");

    // Initialize LLM provider
    const llmProvider = new LLMProviders();

    let spec;
    const useAI = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || opts.useAI;

    if (useAI) {
      // Generate spec using AI
      spec = await llmProvider.generateAndValidate(promptContent, {
        provider: opts.provider,
        model: opts.model,
        temperature: opts.temperature,
        maxTokens: opts.maxTokens,
        maxRetries: 3
      });
    } else {
      // Fallback to demo spec if no AI provider configured
      console.warn("⚠️ No AI provider configured. Using demo spec.");
      console.warn("   Set OPENAI_API_KEY or ANTHROPIC_API_KEY to use AI generation.");

      spec = {
        "page": "DemoPage",
        "route": "/demo",
        "meta": {
          "title": "Demo Page",
          "description": "Generated from prompt (demo mode)"
        },
        "sections": [
          { "type": "CardComponent", "inputs": {"title": "AI Generated (Demo)"}, "children": [
            { "type": "TextComponent", "text": "This component was generated from a prompt in demo mode", "inputs": {"size": "md"} },
            { "type": "ButtonComponent", "text": "Click me", "inputs": {"variant": "primary"} }
          ]}
        ]
      };
    }

    // JSON Schema validation
    if (opts.validate) {
      await validateSpec(spec);
    }

    // Quality gates validation
    const qualityGates = new QualityGates();
    const qualityResults = await qualityGates.validateSpec(spec);

    if (!qualityResults.isValid) {
      console.error("❌ Quality gates failed:");
      console.error(qualityGates.formatResults(qualityResults));
      process.exit(1);
    }

    if (qualityResults.warnings.length > 0) {
      console.warn("⚠️ Quality warnings:");
      console.warn(qualityGates.formatResults(qualityResults));
    }

    // Generate Angular code
    const outFile = angularTranslate(spec, opts.outDir);

    // Validate generated code
    const codeResults = await qualityGates.validateGeneratedCode(outFile);
    if (!codeResults.isValid) {
      console.error("❌ Generated code validation failed:");
      console.error(qualityGates.formatResults(codeResults));
    }

    if (codeResults.warnings.length > 0) {
      console.warn("⚠️ Generated code warnings:");
      console.warn(qualityGates.formatResults(codeResults));
    }

    // Format code
    if (opts.format) {
      await formatCode(outFile);
    }

    console.log("✅ Generated:", outFile);
    return outFile;
  } catch (error) {
    console.error("❌ Prompt generation failed:", error.message);
    process.exit(1);
  }
}

async function formatCode(filePath) {
  try {
    const { execSync } = await import("node:child_process");
    execSync(`npx prettier --write "${filePath}"`, { stdio: 'inherit' });
    console.log("✨ Formatted:", filePath);
  } catch (error) {
    console.warn("⚠️ Formatting failed:", error.message);
  }
}

async function main() {
  const opts = parseArgs();

  if (opts.fromSpec) {
    if (opts.watch) {
      console.log("👁️ Watching:", opts.fromSpec);
      fs.watchFile(opts.fromSpec, () => {
        console.log("🔄 File changed, regenerating...");
        generateFromSpec(opts.fromSpec, opts);
      });
    }
    await generateFromSpec(opts.fromSpec, opts);
  } else if (opts.prompt) {
    await generateFromPrompt(opts.prompt, opts);
  } else {
    console.error("❌ No input specified. Use --from-spec or --prompt");
    console.error("   Run with --help for usage information");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
