import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class LLMProviders {
  constructor() {
    this.systemPrompt = this.loadSystemPrompt();
  }

  loadSystemPrompt() {
    const systemPromptPath = path.join(__dirname, "../../prompts/system-prompt.md");
    if (fs.existsSync(systemPromptPath)) {
      return fs.readFileSync(systemPromptPath, "utf8");
    }
    return this.getDefaultSystemPrompt();
  }

  getDefaultSystemPrompt() {
    return `
You are an expert UI/UX engineer. Convert user requirements into JSON specifications following the provided schema.

Requirements:
1. Use only components from the design system manifest
2. Follow the JSON schema strictly
3. Use design tokens for styling
4. Ensure accessibility compliance
5. Return only valid JSON - no explanations

Generate a complete, valid UI specification.
    `.trim();
  }

  // OpenAI GPT Integration
  async generateWithOpenAI(prompt, options = {}) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }

    const requestBody = {
      model: options.model || "gpt-4",
      messages: [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: options.temperature || 0.1,
      max_tokens: options.maxTokens || 2000,
      response_format: { type: "json_object" }
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No content received from OpenAI");
      }

      return JSON.parse(content);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON response from OpenAI: ${error.message}`);
      }
      throw error;
    }
  }

  // Anthropic Claude Integration
  async generateWithClaude(prompt, options = {}) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is required");
    }

    const requestBody = {
      model: options.model || "claude-3-sonnet-20240229",
      max_tokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.1,
      system: this.systemPrompt,
      messages: [
        { role: "user", content: prompt }
      ]
    };

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0]?.text;

      if (!content) {
        throw new Error("No content received from Claude");
      }

      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\\n?([\\s\\S]*?)```/);
      const jsonContent = jsonMatch ? jsonMatch[1].trim() : content.trim();

      return JSON.parse(jsonContent);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON response from Claude: ${error.message}`);
      }
      throw error;
    }
  }

  // Local LLM Integration (Ollama)
  async generateWithOllama(prompt, options = {}) {
    const host = options.host || "http://localhost:11434";
    const model = options.model || "llama3.1";

    const requestBody = {
      model: model,
      prompt: `${this.systemPrompt}\\n\\nUser Request:\\n${prompt}`,
      stream: false,
      options: {
        temperature: options.temperature || 0.1,
        num_predict: options.maxTokens || 2000
      }
    };

    try {
      const response = await fetch(`${host}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.response;

      if (!content) {
        throw new Error("No content received from Ollama");
      }

      // Extract JSON from the response
      const jsonMatch = content.match(/\\{[\\s\\S]*\\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content.trim();

      return JSON.parse(jsonContent);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON response from Ollama: ${error.message}`);
      }
      throw error;
    }
  }

  // Auto-detect provider based on environment
  async generate(prompt, options = {}) {
    const provider = options.provider || process.env.AI_PROVIDER || "auto";

    switch (provider) {
      case "openai":
        return this.generateWithOpenAI(prompt, options);

      case "claude":
      case "anthropic":
        return this.generateWithClaude(prompt, options);

      case "ollama":
        return this.generateWithOllama(prompt, options);

      case "auto":
        // Try providers in order of preference
        if (process.env.OPENAI_API_KEY) {
          console.log("🤖 Using OpenAI GPT");
          return this.generateWithOpenAI(prompt, options);
        }
        if (process.env.ANTHROPIC_API_KEY) {
          console.log("🤖 Using Anthropic Claude");
          return this.generateWithClaude(prompt, options);
        }
        // Try Ollama as fallback
        try {
          console.log("🤖 Trying local Ollama");
          return this.generateWithOllama(prompt, options);
        } catch (error) {
          throw new Error("No LLM provider available. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or install Ollama");
        }

      default:
        throw new Error(`Unknown AI provider: ${provider}`);
    }
  }

  // Helper to validate generated spec
  async generateAndValidate(prompt, options = {}) {
    const maxRetries = options.maxRetries || 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🤖 Generating spec (attempt ${attempt}/${maxRetries})...`);
        const spec = await this.generate(prompt, options);

        // Basic validation
        if (!spec.page) {
          throw new Error("Generated spec missing required 'page' field");
        }

        console.log(`✅ Generated valid spec for page: ${spec.page}`);
        return spec;

      } catch (error) {
        lastError = error;
        console.warn(`⚠️ Attempt ${attempt} failed:`, error.message);

        if (attempt < maxRetries) {
          console.log("🔄 Retrying...");
          // Add slight delay between retries
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    throw new Error(`Failed to generate valid spec after ${maxRetries} attempts. Last error: ${lastError.message}`);
  }
}

export default LLMProviders;