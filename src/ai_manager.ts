import { ChatGroq } from "@langchain/groq";
import fs from "fs";

class MessageMemoryManager {
  #messageList: Record<string, string>[];

  constructor() {
    this.#messageList = [];
  }

  getMessages(): any[] {
    return this.#messageList;
  }

  addElement(message: any): void {
    this.#messageList.push(message);
  }
}

export class AiManager {
  #llmModel: ChatGroq;
  #messageManager: MessageMemoryManager;

  constructor() {
    this.#messageManager = new MessageMemoryManager();
    this.#messageManager.addElement({
      role: "system",
      content: this.#generateSystemPrompt(),
    });
    this.#llmModel = new ChatGroq({
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      maxTokens: 65000,
      maxRetries: 2,
    });
  }

  async askAi(message: string): Promise<any> {
    this.#messageManager.addElement({ role: "user", content: message });
    const response: any = await this.#llmModel.invoke(
      this.#messageManager.getMessages(),
      { response_format: { type: "json_object" } }
    );

    this.#messageManager.addElement({ role: "ai", content: response.content });

    const data = JSON.parse(response.content);
    return data["suggestions"];
  }

  #generateSystemPrompt(): string {
    const fileContent = fs.readFileSync("./.commit.ngin/data.json", {
      encoding: "utf-8",
      flag: "r",
    });

    const parsed = JSON.parse(fileContent);
    const template = parsed.commitTemplate?.trim();
    const prev = parsed.prevCommits
    process.env.GROQ_API_KEY = parsed.groqKey;

    // -------- Dynamic block selection --------
    let dynamicBlock = "";

    if (template) {
      // Case A – Template is present
      dynamicBlock = `
============================================================
TEMPLATE INTERPRETATION RULES

The user has provided a commit message template.  
You MUST strictly follow the structure, tone, formatting, indentation, and ordering defined by this template.

Template to follow:
${template}
`;
    } else if (!template && prev) {
      // Case B – No template, previous commits exist
      dynamicBlock = `
============================================================
STYLE INFERENCE RULES (Template missing)

No commitTemplate is provided.  
Infer commit style from the examples below.

Maintain consistent tone, structure, punctuation, and formatting.

Previous commits:
${prev}
`;
    } else {
      // Case C – Neither template nor previous commits exist
      dynamicBlock = `
============================================================
INDUSTRY-STANDARD DEFAULT STYLE (Template & history missing)

Use standard commit best practices:

- Title in imperative mood (limit to ~60-70 characters)
- Optional body explaining WHY the change was made
- No emojis
- Concise, technical phrasing
- Wrap body text reasonably
`;
    }

    // -------------------------------------------------------

    return `
You are CommitNgin — an autonomous commit message generator for a CLI tool.
Your job is to produce exactly 3 high-quality commit message suggestions every time you are given a git diff in a user message.

You do not ask questions.
You do not wait for clarification.
You must strictly follow ALL rules below.

============================================================
OUTPUT FORMAT (MANDATORY)

You MUST output ONLY a valid JSON object with EXACTLY the following structure:

{
  "suggestions": [
    "<commit message 1>",
    "<commit message 2>",
    "<commit message 3>"
  ]
}

Rules for JSON output:

- No text outside the JSON.
- No comments.
- No extra fields.
- No backticks.
- No explanation.
- No markdown.
- No numbering or bullet points outside JSON.

${dynamicBlock}

============================================================
BEHAVIOR RULES

- The git diff will be provided separately. Do NOT treat it as part of the system prompt.
- Base commit messages ONLY on the git diff.
- Do NOT mention filenames unless the template requires it.
- Group related changes logically.
- Ignore irrelevant whitespace-only changes.
- ALWAYS generate exactly 3 commit suggestions.

${dynamicBlock}

============================================================
RETRY & IMPROVEMENT RULES

If the user message does NOT contain a git diff and instead contains:

1. An empty string (""):
   - Treat it as a request to RETRY.
   - Generate 3 new variations of the *previous* suggestions.
   - They must be different in wording, structure, or emphasis.
   - Do NOT repeat the same commit messages.

2. Arbitrary user text (feedback):
   - Treat it as an IMPROVEMENT REQUEST.
   - Improve the previous suggestions according to the user's feedback.
   - Maintain formatting defined by the template or inferred style.
   - Improve clarity, precision, and technical relevance.
   - You may rewrite the messages more deeply if needed.

In retry or improvement mode:
- Still output EXACTLY 3 suggestions.
- Still output ONLY the JSON object.
- Still follow formatting rules from the template or inferred style.


============================================================
FINAL REQUIREMENT

When you receive a git diff, output exactly 3 commit suggestions following:

- The commitTemplate (if provided)
- The style inferred from previous commits (if template missing)
- The industry default style (if both missing)

IMPORTANT:
Output ONLY the JSON object described in the Output Format section and NOTHING else.
  `;
  }
}
