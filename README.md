# Dairo 🎨

**Your Intelligent Prompt Engineering Co-pilot.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2FDairo&env=OPENROUTER_API_KEY&project-name=dairo&repository-name=dairo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Dairo is an open-source application designed to bridge the gap between human intent and AI instruction. It takes your simple, everyday language and intelligently engineers it into a detailed, context-aware, and powerful prompt, ready to be used with any Large Language Model.

---

## About The Project

In a world powered by Large Language Models, the quality of your input dictates the quality of your output. However, most of us aren't expert prompt engineers. We know what we want, but we don't know how to ask for it effectively.

**Dairo solves this problem.**

It acts as your personal AI co-pilot, transforming basic prompts into masterfully crafted instructions. More importantly, Dairo doesn't just give you the answer; it shows you its work, explaining *why* the new prompt is better, helping you become a better prompter with every use.

## ✨ Core Features

*   **Intelligent Prompt Engineering:** Leverages a powerful LLM via OpenRouter to rewrite and enrich your prompts.
*   **Side-by-Side Comparison:** Instantly see the difference between your original prompt and Dairo's engineered version.
*   **"Why" Explanations:** Get automated, clear explanations on what improvements were made (e.g., added persona, specified format, etc.).
*   **Local History:** Your past prompts are automatically saved to your browser's local storage for easy access.
*   **Agent System:** (Coming Soon) Use pre-defined agents like "Software Engineer" or "Marketing Expert" to tailor prompts for specific domains.
*   **LLM Playground:** (Coming Soon) Test your engineered prompts against various models directly within the app.

## 🛠️ Built With

This project uses a modern, open-source-friendly tech stack.

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Components:** [Shadcn/UI](https://ui.shadcn.com/)
*   **AI Routing:** [OpenRouter](https://openrouter.ai/)
*   **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn
*   Git

### Installation

1.  **Fork and Clone the Repository:**
    ```sh
    git clone https://github.com/your-username/Dairo.git
    ```
2.  **Navigate to the Project Directory:**
    ```sh
    cd Dairo
    ```
3.  **Install Dependencies:**
    ```sh
    npm install
    ```
4.  **Set Up Environment Variables:**
    Create a file named `.env.local` in the root of your project and add your OpenRouter API key.
    ```env
    OPENROUTER_API_KEY='your-open-router-api-key'
    ```
5.  **Run the Development Server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗺️ Roadmap

Dairo is an evolving project. Here is the planned roadmap:

*   [✅] **Phase 1: Core Engine MVP**
    *   Prompt Engineering & Comparison UI
    *   Automated Explanations
    *   Local Storage History
*   [ ] **Phase 2: The Workflow Hub**
    *   Firebase User Authentication
    *   Cloud-synced Prompt Library (Neon DB)
    *   The LLM Playground
*   [ ] **Phase 3: Advanced Capabilities**
    *   Multi-Step Prompt Chains
    *   Multimodal Prompting Agents (for images)
*   [ ] **Phase 4: The Learning Engine**
    *   Admin Curation & A/B User Feedback

See the [open issues](https://github.com/your-username/Dairo/issues) for a full list of proposed features (and known issues).

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
_Built with passion by [Your Name](https://github.com/your-username)._
