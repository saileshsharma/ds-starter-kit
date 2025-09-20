#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ANSI color codes for better terminal output
const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const templates = {
  dashboard: {
    name: "Dashboard",
    description: "Analytics dashboard with charts, stats, and data tables",
    spec: {
      page: "Dashboard",
      route: "/dashboard",
      meta: { title: "Dashboard", description: "Analytics and metrics dashboard" },
      sections: [
        {
          type: "CardComponent",
          inputs: { title: "Key Metrics", subtitle: "Overview of important statistics" },
          children: [
            {
              type: "StackComponent",
              inputs: { spacing: "3" },
              children: [
                { type: "StatComponent", inputs: { label: "Total Users", value: "1,234", trend: "up", change: "+12%" }},
                { type: "StatComponent", inputs: { label: "Revenue", value: "$45,678", trend: "up", change: "+8%" }},
                { type: "StatComponent", inputs: { label: "Conversion", value: "3.2%", trend: "neutral", change: "0%" }}
              ]
            }
          ]
        },
        {
          type: "CardComponent",
          inputs: { title: "Recent Activity", subtitle: "Latest user actions" },
          children: [
            {
              type: "DataTableComponent",
              inputs: {
                columns: [
                  { key: "user", header: "User" },
                  { key: "action", header: "Action" },
                  { key: "timestamp", header: "Time" }
                ],
                dataSource: { kind: "graphql", query: "GET_RECENT_ACTIVITY", variables: { limit: 10 }}
              }
            }
          ]
        }
      ]
    }
  },
  form: {
    name: "Form Page",
    description: "User input form with validation and submission",
    spec: {
      page: "FormPage",
      route: "/form",
      meta: { title: "Form", description: "User input form" },
      sections: [
        {
          type: "CardComponent",
          inputs: { title: "User Information", subtitle: "Please fill out your details" },
          children: [
            {
              type: "FormComponent",
              inputs: { formGroup: "userForm" },
              children: [
                {
                  type: "StackComponent",
                  inputs: { spacing: "4" },
                  children: [
                    { type: "InputComponent", inputs: { placeholder: "Full Name", formControlName: "name", required: true }},
                    { type: "InputComponent", inputs: { placeholder: "Email", type: "email", formControlName: "email", required: true }},
                    { type: "SelectComponent", inputs: { placeholder: "Select Role", formControlName: "role", options: [
                      { value: "user", label: "User" },
                      { value: "admin", label: "Administrator" },
                      { value: "manager", label: "Manager" }
                    ]}},
                    { type: "ButtonComponent", text: "Submit", inputs: { variant: "primary", size: "md" }, outputs: { click: "onSubmit" }}
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  listing: {
    name: "Data Listing",
    description: "Data table with search, filters, and pagination",
    spec: {
      page: "DataListing",
      route: "/listing",
      meta: { title: "Data Listing", description: "Browse and manage data" },
      sections: [
        {
          type: "CardComponent",
          inputs: { title: "Search & Filters" },
          children: [
            {
              type: "StackComponent",
              inputs: { spacing: "3" },
              children: [
                { type: "InputComponent", inputs: { placeholder: "Search...", type: "text" }},
                { type: "SelectComponent", inputs: { placeholder: "Filter by status", options: [
                  { value: "all", label: "All" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" }
                ]}}
              ]
            }
          ]
        },
        {
          type: "CardComponent",
          inputs: { title: "Results" },
          children: [
            {
              type: "DataTableComponent",
              inputs: {
                columns: [
                  { key: "id", header: "ID" },
                  { key: "name", header: "Name" },
                  { key: "status", header: "Status" },
                  { key: "created", header: "Created" }
                ],
                dataSource: { kind: "rest", query: "/api/items", variables: { page: 1, limit: 20 }},
                sortable: true,
                pagination: true
              }
            }
          ]
        }
      ]
    }
  },
  settings: {
    name: "Settings Page",
    description: "User preferences and configuration options",
    spec: {
      page: "SettingsPage",
      route: "/settings",
      meta: { title: "Settings", description: "User preferences and settings" },
      sections: [
        {
          type: "CardComponent",
          inputs: { title: "Account Settings" },
          children: [
            {
              type: "FormComponent",
              inputs: { formGroup: "accountForm" },
              children: [
                {
                  type: "StackComponent",
                  inputs: { spacing: "4" },
                  children: [
                    { type: "InputComponent", inputs: { placeholder: "Display Name", formControlName: "displayName" }},
                    { type: "InputComponent", inputs: { placeholder: "Email", type: "email", formControlName: "email" }},
                    { type: "SelectComponent", inputs: { placeholder: "Timezone", formControlName: "timezone", options: [
                      { value: "utc", label: "UTC" },
                      { value: "est", label: "Eastern" },
                      { value: "pst", label: "Pacific" }
                    ]}}
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "CardComponent",
          inputs: { title: "Notifications" },
          children: [
            {
              type: "StackComponent",
              inputs: { spacing: "3" },
              children: [
                { type: "TextComponent", text: "Email notifications:", inputs: { weight: "medium" }},
                { type: "TextComponent", text: "Push notifications:", inputs: { weight: "medium" }},
                { type: "ButtonComponent", text: "Save Settings", inputs: { variant: "primary" }}
              ]
            }
          ]
        }
      ]
    }
  }
};

function showWelcome() {
  console.log(`
${colors.bold}${colors.blue}🚀 AI Builder Page Creator${colors.reset}
${colors.cyan}Create Angular pages using your design system${colors.reset}

Choose how you'd like to create your page:
`);
}

function showTemplates() {
  console.log(`${colors.bold}${colors.yellow}📋 Available Templates:${colors.reset}`);
  Object.entries(templates).forEach(([key, template], index) => {
    console.log(`${colors.green}${index + 1}.${colors.reset} ${colors.bold}${template.name}${colors.reset} - ${template.description}`);
  });
  console.log(`${colors.green}5.${colors.reset} ${colors.bold}Custom Prompt${colors.reset} - Describe your own page with AI`);
  console.log(`${colors.green}6.${colors.reset} ${colors.bold}Edit Specification${colors.reset} - Modify existing JSON specification`);
}

function showCommands() {
  console.log(`
${colors.bold}${colors.yellow}🔧 Quick Commands:${colors.reset}
${colors.cyan}npm run ai:demo${colors.reset}              - Generate generic demo page
${colors.cyan}npm run ai:demo:watch${colors.reset}        - Watch mode for development
${colors.cyan}npm run ai:demo:claims${colors.reset}       - Generate claims dashboard example
${colors.cyan}node scripts/create-page.mjs${colors.reset} - This interactive creator
`);
}

async function createFromTemplate(templateKey) {
  const template = templates[templateKey];
  if (!template) {
    console.log(`${colors.red}❌ Template not found${colors.reset}`);
    return;
  }

  const fileName = `examples/${template.spec.page.toLowerCase()}.spec.json`;

  console.log(`${colors.blue}📝 Creating ${template.name}...${colors.reset}`);

  // Write specification file
  fs.writeFileSync(fileName, JSON.stringify(template.spec, null, 2));
  console.log(`${colors.green}✅ Created specification: ${fileName}${colors.reset}`);

  // Generate component
  console.log(`${colors.blue}🔧 Generating Angular component...${colors.reset}`);

  const { execSync } = await import("child_process");
  try {
    execSync(`node scripts/ai-build/run.mjs --from-spec ${fileName} --format`, { stdio: 'inherit' });
    console.log(`${colors.green}✅ Generated component: src/pages/${template.spec.page.toLowerCase()}.component.ts${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}❌ Generation failed: ${error.message}${colors.reset}`);
  }
}

async function createFromPrompt() {
  console.log(`${colors.yellow}💡 Creating page from AI prompt...${colors.reset}`);
  console.log(`${colors.cyan}Example: "Create a user profile page with avatar upload, personal info form, and activity timeline"${colors.reset}`);

  // For now, show instructions - full AI integration would require readline
  console.log(`
${colors.bold}To create from AI prompt:${colors.reset}
1. Create a prompt file: ${colors.cyan}echo "Your description here" > prompts/my-page.md${colors.reset}
2. Generate with AI: ${colors.cyan}OPENAI_API_KEY=sk-xxx npm run ai:build -- --prompt prompts/my-page.md${colors.reset}
3. Or use without AI: ${colors.cyan}npm run ai:build -- --prompt prompts/my-page.md --use-ai${colors.reset}
`);
}

function showNextSteps() {
  console.log(`
${colors.bold}${colors.yellow}🎯 Next Steps:${colors.reset}
${colors.cyan}1.${colors.reset} View your generated component: ${colors.cyan}cat src/pages/*.component.ts${colors.reset}
${colors.cyan}2.${colors.reset} Validate the code: ${colors.cyan}npm run ai:quality examples/*.spec.json${colors.reset}
${colors.cyan}3.${colors.reset} Customize design system: ${colors.cyan}edit design-system/components.manifest.json${colors.reset}
${colors.cyan}4.${colors.reset} Watch for changes: ${colors.cyan}npm run ai:demo:watch${colors.reset}

${colors.bold}${colors.green}🎉 Happy building with your design system!${colors.reset}
`);
}

// Main execution
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showWelcome();
    showTemplates();
    showCommands();
    console.log(`
${colors.bold}Usage Examples:${colors.reset}
${colors.cyan}node scripts/create-page.mjs dashboard${colors.reset}  - Create dashboard page
${colors.cyan}node scripts/create-page.mjs form${colors.reset}       - Create form page
${colors.cyan}node scripts/create-page.mjs listing${colors.reset}    - Create data listing page
${colors.cyan}node scripts/create-page.mjs settings${colors.reset}   - Create settings page
${colors.cyan}node scripts/create-page.mjs prompt${colors.reset}     - Instructions for AI prompts
`);
    return;
  }

  const command = args[0].toLowerCase();

  if (command === 'prompt') {
    createFromPrompt();
  } else if (templates[command]) {
    createFromTemplate(command);
    showNextSteps();
  } else {
    console.log(`${colors.red}❌ Unknown template: ${command}${colors.reset}`);
    console.log(`${colors.yellow}Available templates: ${Object.keys(templates).join(', ')}, prompt${colors.reset}`);
  }
}

main();