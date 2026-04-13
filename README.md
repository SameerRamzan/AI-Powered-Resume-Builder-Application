# ResumeAI Pro — AI-Powered Resume Assistant

<div align="center">

![ResumeAI Pro Banner](https://img.shields.io/badge/ResumeAI-Pro-7C3AED?style=for-the-badge&logo=sparkles&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge)

**Expert-level resume coaching powered by AI — no signup, no server, completely private.**

[Features](#-features) · [Demo](#-demo) · [Getting Started](#-getting-started) · [Tech Stack](#-tech-stack) · [Project Structure](#-project-structure) · [AI System](#-ai-prompt-system) · [Contributing](#-contributing)

</div>

---

## Overview

**ResumeAI Pro** is a premium, client-side AI resume assistant that coaches users through building ATS-optimized, high-impact resumes. Powered by **Google Gemini**, it analyzes your resume against a target job description, scores it, and provides interactive coaching to help you land more interviews.

> **Zero backend. Zero signup. Zero data leakage.** All AI calls go directly from your browser to Google's API. Your resume never touches a third-party server.

---

## Features

- **ATS Score Analysis** — Circular gauge scoring your resume on keyword match, formatting, impact, clarity, and relevance
- **Keyword Gap Detection** — Identifies missing keywords from the target job description and suggests where to insert them
- **Section-by-Section Breakdown** — Detailed analysis of each resume section (Summary, Experience, Education, Skills)
- **Interactive AI Coach** — Chat-style coaching interface with before/after bullet point transformations
- **Full Resume Improvement** — One-click generation of a complete, AI-optimized resume preserving your authentic experience
- **Export** — Copy to clipboard or download the improved resume as a text file
- **Privacy-first** — API key stored only in `localStorage`, never transmitted to any server other than Google's API
- **No signup required** — Works entirely in the browser with your own free Gemini API key

---

## Example Transformations

The AI coach rewrites weak resume bullets into high-impact, quantified statements:

| ❌ Before | ✅ After |
|-----------|---------|
| "Responsible for managing a team" | "Led and mentored a cross-functional team of 8 engineers, delivering 3 major product launches on time and 15% under budget" |
| "Helped with marketing campaigns" | "Spearheaded 12 data-driven marketing campaigns that generated $2.4M in pipeline revenue and increased lead conversion by 34%" |
| "Did data analysis" | "Engineered automated data pipelines processing 500K+ daily records, reducing reporting time by 60% and enabling real-time executive decision-making" |

---

## User Flow

```
🏠 Landing Page
      ↓
🔑 API Key Setup  (stored locally in localStorage)
      ↓
📄 Paste Your Resume
      ↓
💼 Paste Target Job Description
      ↓
⚡ ATS Score + Analysis Dashboard
      ↓
🤖 Interactive AI Coach  (chat-style, before/after rewrites)
      ↓
📋 Export Improved Resume
      ↓  (loop back to refine)
📄 Paste Your Resume
```

---

## Demo

> 🔗 **Live Demo**: *(Add your deployed URL here)*

To run locally, follow the [Getting Started](#-getting-started) guide below.

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- A free **Google Gemini API key** — get one at [aistudio.google.com](https://aistudio.google.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SameerRamzan/AI-Powered-Resume-Builder-Application.git

# 2. Navigate into the project
cd AI-Powered-Resume-Builder-Application

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open your browser at `http://localhost:5173` and you're ready to go.

### Production Build

```bash
npm run build
```

The optimized build output will be in the `dist/` folder, ready for deployment on any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

### API Key Setup

When you first open the app, you'll be prompted to enter your Gemini API key. You can get a **free key** at [Google AI Studio](https://aistudio.google.com):

1. Visit [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **"Get API Key"** → **"Create API key"**
4. Paste the key into the app's API Key Setup screen

> Your key is saved in your browser's `localStorage` and is **never sent to any server** other than Google's own API.

---

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| **Build Tool** | [Vite](https://vitejs.dev/) | Fast dev server, HMR, optimized production builds |
| **Frontend** | Vanilla JS + CSS | No framework overhead, full control, zero dependencies |
| **Styling** | Custom CSS | Dark mode glassmorphism, smooth animations, micro-interactions |
| **AI** | [Google Gemini API](https://ai.google.dev/) via `@google/genai` | Free tier, powerful, latest models |
| **Architecture** | Client-side only | No server costs, total privacy for users |
| **Fonts** | Inter (Google Fonts) | Clean, modern, professional typography |

### Design System

| Token | Value |
|-------|-------|
| Primary | `hsl(250, 80%, 65%)` — vibrant purple |
| Accent | `hsl(170, 75%, 55%)` — teal/cyan |
| Background | Deep navy with subtle gradients |
| Cards | Frosted glass (`backdrop-filter: blur`) |
| Theme | Dark mode with glassmorphism |

---

## Project Structure

```
AI-Powered-Resume-Builder-Application/
├── index.html                  # Single-page app entry point
├── package.json                # Dependencies (Vite + @google/genai)
├── vite.config.js              # Vite configuration
└── src/
    ├── main.js                 # App entry point, router, global state
    ├── styles/
    │   ├── index.css           # Global styles, design tokens, animations
    │   ├── components.css      # Component-specific styles
    │   └── screens.css         # Screen layout styles
    ├── screens/                # 7-step guided user flow
    │   ├── landing.js          # Landing/hero page
    │   ├── apiSetup.js         # API key input & validation
    │   ├── resumeInput.js      # Resume paste/input form
    │   ├── jobInput.js         # Job description input
    │   ├── analysis.js         # ATS scoring dashboard
    │   ├── coach.js            # Interactive AI coaching chat
    │   └── results.js          # Final results & export
    ├── services/               # Core business logic
    │   ├── gemini.js           # Gemini API integration & prompt system
    │   ├── parser.js           # Resume text parsing utilities
    │   ├── scorer.js           # ATS scoring algorithm
    │   └── keywords.js         # Keyword extraction & matching
    ├── components/             # Reusable UI components
    │   ├── scoreGauge.js       # Circular ATS score visualization
    │   ├── beforeAfter.js      # Before/after comparison cards
    │   ├── chatBubble.js       # AI coach chat message bubbles
    │   └── navbar.js           # Navigation & progress bar
    └── utils/
        ├── storage.js          # localStorage helpers
        └── helpers.js          # General utility functions
```

---

## AI Prompt System

The prompt system is the heart of ResumeAI Pro. It consists of four specialized AI prompts, all using **structured JSON output** for reliable parsing. The system prompt establishes the AI as a senior recruiter with deep ATS expertise.

### 1. Resume Analyzer
Parses raw resume text into structured sections, identifies strengths and weaknesses, and extracts skills, experience level, and industry.

### 2. ATS Scorer
Compares the resume against the target job description. Scores across five dimensions:

- Keyword Match
- Formatting & Structure
- Impact & Quantification
- Clarity & Readability
- Job Relevance

### 3. Resume Coach
Powers the interactive chat interface. Uses a **critique → improve → confirm** loop:
- Suggests improved bullet points using action verbs and quantifiable outcomes
- Provides before/after transformations
- Asks targeted follow-up questions to gather missing context

### 4. Resume Improver
Takes the full resume + job description + analysis and outputs a **complete, optimized resume** — preserving the user's authentic experience while upgrading the language, structure, and keyword density.

---

## Screens

| # | Screen | Description |
|---|--------|-------------|
| 1 | **Landing / Hero** | App intro, value proposition, "Get Started" CTA |
| 2 | **API Key Setup** | Simple key input with live validation |
| 3 | **Resume Input** | Large textarea with paste support and optional structured fields |
| 4 | **Job Description Input** | Paste the target job posting |
| 5 | **Analysis Dashboard** | ATS score gauge, keyword match grid, section-by-section breakdown |
| 6 | **AI Coach** | Chat-style interface with interactive rewrites and before/after cards |
| 7 | **Results & Export** | Final improved resume with copy-to-clipboard and text download |

---

## Privacy & Security

- **No backend server** — the app runs entirely in your browser
- **API key stored locally** — saved in `localStorage`, never transmitted to any server owned by this project
- **No analytics, no tracking** — zero third-party data collection
- **No account required** — nothing is stored about you anywhere

> ⚠️ **Note for Production Use**: For a production deployment with shared API access, it is recommended to move the API key to a backend proxy to avoid exposing it in the browser. This MVP is designed for personal or self-hosted use where users provide their own Gemini key.

---

## Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repo, then clone your fork
git clone https://github.com/YOUR_USERNAME/AI-Powered-Resume-Builder-Application.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes, then commit
git commit -m "feat: add your feature description"

# Push and open a Pull Request
git push origin feature/your-feature-name
```

### Development Checklist

Before submitting a PR, verify:

- [ ] `npm run dev` — dev server starts without errors
- [ ] `npm run build` — production build succeeds
- [ ] Full user flow works end-to-end (Landing → Export)
- [ ] Gemini API calls work with a valid key
- [ ] Responsive layout looks correct on mobile and tablet
- [ ] Copy-to-clipboard and text export function correctly

---

## Roadmap

- [ ] Backend proxy for shared API key deployments
- [ ] PDF export of the improved resume
- [ ] Multiple resume template styles
- [ ] Resume version history
- [ ] LinkedIn profile import
- [ ] Cover letter generation

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**Sameer Ramzan**  
[GitHub](https://github.com/SameerRamzan) · [LinkedIn](https://linkedin.com/in/sameer-ramzan)

---

<div align="center">
  <sub>Built with ❤️ using Google Gemini AI · No signup · No server · Completely private</sub>
</div>
