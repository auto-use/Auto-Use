<div align="center">
  <img src="auto_use.png" alt="Auto Use Logo" width="120"/>

  # Auto Use

  **Agent with Million Moves.**

  🖥️ Windows &nbsp;•&nbsp; 🍎 macOS &nbsp;•&nbsp; 🔌 MCP Server for Claude Desktop

  [![Download](https://img.shields.io/badge/Download_Latest-Release-blue?style=for-the-badge)](https://github.com/auto-use/Auto-Use/releases)

</div>

---

### Quick Start

1. Download the latest setup from the [release section](https://github.com/auto-use/Auto-Use/releases)
2. Run the installer — everything is packed into a single binary, no additional software needed
3. Connect to Claude Desktop as an MCP server and start automating

> **No Python. No Node. No dependencies. Just install and go.**

---

<img src="demo.gif" alt="Auto Use Demo" width="100%"/>

<p align="center">
  <strong>👇 Watch full video demos</strong>
</p>

<p align="center">
  <a href="https://drive.google.com/file/d/13FrZzM-dsyxSxlFZwmbfMnHmmpOp3jxx/view?usp=sharing"><img src="https://img.shields.io/badge/▶_OS_+_Coding_Demo-4285F4?style=for-the-badge&logo=google-drive&logoColor=white" alt="OS + Coding Demo"/></a>
  &nbsp;&nbsp;
  <a href="https://drive.google.com/file/d/1cPFu5SHA0udp9ErLandowRcaYIqfM30H/view?usp=sharing"><img src="https://img.shields.io/badge/▶_Coding_Task_Demo-34A853?style=for-the-badge&logo=google-drive&logoColor=white" alt="Coding Task Demo"/></a>
  &nbsp;&nbsp;
  <a href="https://drive.google.com/file/d/1iTC_nGRIuAsEBBOudjccU_pBi5bxXQm3/view?usp=sharing"><img src="https://img.shields.io/badge/▶_OS_Based_Web_Scraping-EA4335?style=for-the-badge&logo=google-drive&logoColor=white" alt="OS Based Web Scraping"/></a>
</p>

---

## ✨ Features

### 🕷️ Undetectable Web Scraping

Scrape any website that traditional CDP-based tools can't touch. Auto Use drives a real browser through pure vision and sophisticated UI scanning — no Chrome DevTools Protocol, no debugging ports, no injected scripts. The browser runs exactly as a human would use it, making detection virtually impossible while keeping your security fully intact.

### 🔍 Human-Like Screen Perception

Auto Use sees your screen the way you do. It captures screenshots, maps the depth and layering of every window, and identifies which icons, folders, options, and text are visible, and how much of each is visible. This awareness lets the agent make precise, context-driven decisions about where to click, scroll, or type to complete your task.

### 🌐 Any Browser, Any App

Works with every browser: Chrome, Edge, Firefox, Arc, Brave, Safari, and more. No debugging bridge, no browser extension, no special configuration. If you can see it on screen, Auto Use can interact with it.

### 🧠 Collaborative Multi-Agent Framework

Multiple specialized agents operate independently yet coordinate seamlessly when the task demands it, sharing context in real time. The framework intelligently decides which combination of agents can accomplish a task fastest: a GUI click here, a shell command there, a quick web lookup in between, all orchestrated automatically.

### 📚 Adaptive Context Intelligence

Agents are environment-aware. They detect which application or workflow they're operating in and pull relevant efficiency guidelines on the fly. Inject your own expertise, whether it's app-specific shortcuts, internal processes, or operational playbooks, and the system absorbs it instantly, sharpening its behavior to make every task faster and more seamless.

### 🔒 Sandboxed Execution

The CLI agent is confined to an isolated sandbox. All coding and shell tasks run strictly inside it and cannot touch critical system paths. Your OS stays protected while the agent builds, tests, and executes code freely within its boundaries.

### 💾 3-Stage Memory Management

A sophisticated three-stage memory system lets agents carry context well beyond a single context window. Long-running, multi-step sessions stay on track without information loss. Intelligent chunking, real-time context optimization, and priority-based compression all happen seamlessly in the background with zero delay.

### ⚡ Kernel-Level Interaction

The GUI agent interfaces at the OS kernel level using low-level input drivers, enabling it to operate smoothly even in restricted scenarios like User Account Control (UAC) dialogs and elevated prompts that block conventional automation tools.

### 🎛️ Multi-Provider Support

Choose from 15+ AI models across OpenAI, Anthropic, Google Gemini, Groq, OpenRouter, and Perplexity. Switch providers based on speed, cost, or capability needs.

---

## 🤖 What You Can Ask

Just tell Auto Use what you need. It figures out the rest.

### 🖥️ Desktop Automation
> *"Open Chrome, go to YouTube, and search for Python tutorials"*

Interacts with any application through vision: clicks, types, scrolls, navigates menus, and verifies every step before moving on.

### 💻 Terminal & System Tasks
> *"Check disk space and clean up temp files"*

Executes shell commands, navigates file systems, manages processes, and handles system operations inside a secure sandbox.

### 👨‍💻 Code Generation & Editing
> *"Create a Python Flask API with user authentication"*

Writes new files, edits existing code with precision, debugs errors, runs tests, and cleans up without ever leaving the sandbox.

### 🌐 Real-Time Web Lookup
> *"Find the latest NVIDIA stock price and quarterly revenue"*

Searches multiple sources, extracts and summarizes data in real time, and feeds findings directly into the ongoing task.

---

## 🎯 Capability Overview


| Category         | Examples                                                 |
| ---------------- | -------------------------------------------------------- |
| **Browser**      | Fill forms, extract data, navigate sites, download files |
| **Productivity** | Create documents, manage spreadsheets, organize files    |
| **Development**  | Write code, debug errors, run tests, manage git          |
| **System**       | Install software, configure settings, manage processes   |
| **Research**     | Search web, compile information, generate reports        |


---

## 🧠 Supported Models

Auto Use supports **15+ vision-language models** across 6 providers.

### OpenAI (Direct)


| Model            | Model Key      | Reasoning | Vision |
| ---------------- | -------------- | --------- | ------ |
| **GPT-5.4 Mini** | `gpt-5.4-mini` | ✅         | ✅      |
| **GPT-5.4**      | `gpt-5.4`      | ✅         | ✅      |

🔗 [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Anthropic (Direct)


| Model                 | Model Key          | Vision |
| --------------------- | ------------------ | ------ |
| **Claude Haiku 4.5**  | `claude-haiku-4.5`  | ✅      |
| **Claude Sonnet 4.5** | `claude-sonnet-4.5` | ✅      |
| **Claude Opus 4.5**   | `claude-opus-4.5`   | ✅      |
| **Claude Opus 4.6**   | `claude-opus-4.6`   | ✅      |
| **Claude Sonnet 4.6** | `claude-sonnet-4.6` | ✅      |

🔗 [console.anthropic.com](https://console.anthropic.com)

### Google Gemini (Direct + Vertex)


| Model                         | Model Key                | Reasoning | Vision | Vertex |
| ----------------------------- | ------------------------ | --------- | ------ | ------ |
| **Gemini 3.1 Pro**            | `gemini-3.1-pro`         | ✅         | ✅      | ❌      |
| **Gemini 3 Flash**            | `gemini-3-flash`         | ✅         | ✅      | ❌      |
| **Gemini 3.1 Pro (Vertex)**   | `gemini-3.1-pro-vertex`  | ✅         | ✅      | ✅      |
| **Gemini 3 Flash (Vertex)**   | `gemini-3-flash-vertex`  | ✅         | ✅      | ✅      |

🔗 [aistudio.google.dev](https://aistudio.google.dev)

### Groq


| Model                 | Model Key        | Reasoning | Vision | Notes             |
| --------------------- | ---------------- | --------- | ------ | ----------------- |
| **GPT-OSS 120B**      | `gpt-oss-120b`   | ✅         | ❌      | Coding agent only |
| **Llama 4 Scout 17B** | `llama-4-scout`  | ❌         | ✅      |                   |

🔗 [console.groq.com/keys](https://console.groq.com/keys)

### OpenRouter


| Model                      | Model Key          | Reasoning | Vision |
| -------------------------- | ------------------ | --------- | ------ |
| **Gemini 3.1 Pro Preview** | `gemini-3.1-pro`   | ✅         | ✅      |
| **Gemini 3 Flash Preview** | `gemini-3-flash`   | ✅         | ✅      |
| **GPT-5.4 Mini**           | `gpt-5.4-mini`     | ✅         | ✅      |
| **GPT-5.4 Pro**            | `gpt-5.4-pro`      | ❌         | ✅      |
| **Claude Opus 4.6**        | `claude-opus-4.6`  | ✅         | ✅      |
| **Claude Sonnet 4.6**      | `claude-sonnet-4.6`| ✅         | ✅      |
| **Grok 4 Fast**            | `grok-4-fast`      | ✅         | ✅      |
| **Grok 4.1 Fast**          | `grok-4.1-fast`    | ✅         | ✅      |
| **Kimi K2.5**              | `kimi-k2.5`        | ❌         | ✅      |

🔗 [openrouter.ai/keys](https://openrouter.ai/keys)

### Perplexity


| Model                      | Model Key          | Reasoning | Vision |
| -------------------------- | ------------------ | --------- | ------ |
| **GPT-5.4**                | `gpt-5.4`          | ✅         | ✅      |
| **Gemini 3.1 Pro Preview** | `gemini-3.1-pro`   | ✅         | ✅      |
| **Gemini 3 Flash Preview** | `gemini-3-flash`   | ✅         | ✅      |
| **Claude Sonnet 4.6**      | `claude-sonnet-4.6`| ✅         | ✅      |
| **Claude Opus 4.6**        | `claude-opus-4.6`  | ✅         | ✅      |
| **Perplexity Sonar**       | `sonar`             | ❌         | ❌      |

🔗 [perplexity.ai](https://www.perplexity.ai)

---

## 🎮 Model Selection Guide


| Use Case         | Recommended Model                | Why                                   |
| ---------------- | -------------------------------- | ------------------------------------- |
| **Fast & Cheap** | `gemini-3-flash`                 | Great balance of speed and capability |
| **Most Capable** | `claude-opus-4.6` / `gemini-3.1-pro` | Best reasoning for complex tasks |
| **Ultra-Fast**   | `llama-4-scout` (Groq)          | Lowest latency                        |
| **Coding Agent** | `gpt-oss-120b` (Groq)           | Coding agent only                     |
| **Best Vision**  | `claude-sonnet-4.6` / `claude-opus-4.6` | Excellent UI understanding   |
| **Web Search**   | `sonar` (Perplexity)            | Built-in search capabilities          |


---

## 📋 Requirements

- **Windows 10/11** (64-bit) or **macOS**
- **API Key** from any supported provider
- That's it. Everything else is bundled in the installer.

---

## 🛡️ Safety & Privacy

- **Sandbox Isolation** — Code runs in a protected environment
- **No System Modification** — Won't delete files or run destructive commands without permission
- **UAC Awareness** — Asks for confirmation before accepting elevation prompts
- **Path Protection** — Blocks access to critical system folders
- **Fully Local** — All processing happens on your machine. No data leaves your device unless you explicitly use a cloud AI provider's API.

---

## 🌟 Why Auto Use?


| Feature                    | Auto Use | Others  |
| -------------------------- | -------- | ------- |
| Works on any browser       | ✅        | ❌       |
| No debugging bridge needed | ✅        | ❌       |
| Multi-agent system         | ✅        | ❌       |
| Knowledge system           | ✅        | ❌       |
| 15+ model support          | ✅        | Limited |
| Vision-based automation    | ✅        | ✅       |
| Coding MCP                 | ✅        | ❌       |
| Web search integration     | ✅        | ❌       |
| Secure sandbox             | ✅        | ❌       |
| Zero dependencies          | ✅        | ❌       |


---

## 💻 Supported Platforms


| Operating System    | Status      |
| ------------------- | ----------- |
| **Windows 10/11**   | ✅ Supported |
| **macOS**           | ✅ Supported |

---

## 📬 Support

- **Issues:** [GitHub Issues](https://github.com/auto-use/Auto-Use/issues)
- **Email:** ashishyadav.uk@outlook.com

---

## 📄 License

Auto Use is proprietary software. All rights reserved.