# Commit Ngin

Commit Ngin is an AI-powered CLI tool that analyzes your staged Git diff and generates high-quality commit message suggestions.  
You simply choose **1**, **2**, or **3**, and Commit Ngin automatically performs the commit for you.

It also supports **chat-based refinement**, allowing you to customize or regenerate messages before committing.

---

## ⚠️ Requirements

Commit Ngin uses **Groq** for inference.  
You must have:

### 1. A Groq API key  
Create one at:  
https://console.groq.com/keys

### 2. Add `.commit.ngin/` to `.gitignore`  
This directory stores:

- Your **Groq API key**
- Optional **commit message template**
- **Previous commits** (used for style learning)

Do **NOT** commit this directory.

---

## Features

- Uses Groq LLMs (currently `openai/gpt-oss-120b`)
- Generates **three** commit message suggestions
- Auto-commits after selecting 1 / 2 / 3
- Chat mode for refining commit messages
- Press Enter for regenerating suggestions
- Zero configuration after initialization
- Optional commit message template support
- Learns style from previous commits

---

## Installation

```bash
npm install -g commit-ngin
```

Verify installation:

```bash
commit-ngin --version
```

---

## Initialization (Required Before First Use)

Run:

```bash
commit-ngin --init
```

You will be prompted for:

- **Project description**
- **Groq API key**
- **Optional commit message template**

After initialization, ensure:

```
.commit.ngin/
```

is added to your `.gitignore`.

---

## Usage

Stage files:

```bash
git add .
```

Run Commit Ngin:

```bash
commit-ngin
```

The CLI will:

1. Read your staged diff  
2. Generate 3 commit messages  
3. Prompt you for a choice  
4. Automatically commit using your selection  

---

## Options During Execution

| Input | Action |
|-------|--------|
| **1 / 2 / 3** | Auto-commit using selected suggestion |
| **Enter** | Regenerate suggestions |
| **Custom text** | Chat with the AI to improve suggestions |
| **q** | Quit |

---

## Example Workflow

```
$ git add src/
$ commit-ngin
```

Suggestions:

```
[1] feat: add validation to session manager
[2] refactor: simplify user auth flow
[3] fix: correct null handling in token parser
```

User selects:

```
[INPUT]: 1
```

CLI performs:

```
git commit -m "feat: add validation to session manager"
SUCCESS !!!
Thanks for using ⊂(◉‿◉)つ
```

---

## Chat Mode Example

User types:

```
make it more formal
```

AI generates improved suggestions.

User presses Enter:

AI regenerates new variations.

---

## How It Works

- Reads diff from: `git diff --staged`
- Sends diff + context to Groq LLM
- LLM returns exactly 3 JSON-formatted suggestions
- User selects → CLI commits
- Commit stored locally for style inference

---

## Development Setup

Clone:

```bash
git clone https://github.com/0xv1shal/commit-ngin
cd commit-ngin
```

Install:

```bash
npm install
```

Build:

```bash
npm run build
```

Test globally:

```bash
npm link
commit-ngin
```

---

## Project Structure

```
commit-ngin/
 ├─ src/
 │   ├─ index.ts
 │   ├─ ai_manager.ts
 │   ├─ ui_manager.ts
 │   ├─ file_manager.ts
 │   └─ ...
 ├─ dist/
 ├─ package.json
 └─ tsconfig.json
```

---

## Contributing

Issues and PRs welcome:  
https://github.com/0xv1shal/commit-ngin/issues

---

## License

ISC License.

