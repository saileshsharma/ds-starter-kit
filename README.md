
# AI Builder Starter (Design System–aware)

This kit lets you turn **AI output** (a structured UI spec) into **real React pages** that use your design system components.

## Quick start

```bash
# 1) inside your existing web repo
cp -R ai-builder-starter/* .

# 2) install deps
npm i

# 3) try the demo
npm run ai:demo
# -> outputs: src/pages/ClaimsDashboard.jsx
```

Open the generated file and wire it into your router.

## How to use with your Design System CLI

1. Export your design tokens to `design-system/tokens.json`.
2. List all components (and import source) in `design-system/components.manifest.json`.
3. Have the AI produce a **spec JSON** that follows `scripts/ai-build/schema/ui-spec.schema.json`.
4. Generate code:
   ```bash
   node scripts/ai-build/run.mjs --from-spec examples/claims-dashboard.spec.json --out src/pages
   ```

## Wiring an LLM

`run.mjs` includes a stub `--prompt` flow. Replace the stub with your provider call and return a JSON that validates against the schema.

## Guardrails

- JSON Schema validation via Ajv (`ai:validate`).
- Manifest-driven imports so AI cannot invent components.
- Deterministic translator: spec → JSX.

## Customize

- Extend the schema (e.g., slot definitions, events).
- Enhance the translator to map `dataSource` to your data layer (GraphQL/REST hooks).
- Add ESLint/TS, tests, and visual snapshots in your repo.
# ds-starter-kit
