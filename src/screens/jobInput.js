/* ============================================================
   ResumeAI Pro — Job Description Input Screen
   ============================================================ */

import { wordCount } from '../utils/helpers.js';

export function renderJobInput(state) {
  return `
    <div class="input-screen animate-fade-in-up">
      <div class="input-screen-header">
        <h2>💼 Paste the Job Description</h2>
        <p class="text-secondary">
          Paste the job posting you're targeting. The AI will analyze keyword matches,
          identify gaps, and tailor its recommendations to this specific role.
        </p>
      </div>

      <div class="input-group">
        <label class="input-label" for="job-textarea">Job Description</label>
        <textarea
          class="input-field"
          id="job-textarea"
          placeholder="Paste the full job description here...

Include:
- Job title and company
- Requirements and qualifications
- Responsibilities
- Nice-to-have skills
- Any other relevant details"
          style="min-height: 340px; font-size: var(--font-sm);"
        >${state.jobDescription || ''}</textarea>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="char-count" id="job-char-count">
            ${state.jobDescription ? wordCount(state.jobDescription) + ' words' : '0 words'}
          </span>
          <button class="btn btn-ghost btn-sm" id="load-sample-job">
            📋 Load Sample Job
          </button>
        </div>
      </div>

      <div class="input-tips">
        <div class="input-tips-title">
          🎯 Why This Matters
        </div>
        <ul>
          <li>75% of resumes are rejected by ATS before a human sees them</li>
          <li>Keyword matching between your resume and the job description is critical</li>
          <li>The more detailed the job posting, the better the AI can optimize your resume</li>
          <li>Include the full posting — requirements, responsibilities, and nice-to-haves</li>
        </ul>
      </div>

      <div class="input-actions">
        <button class="btn btn-ghost" id="back-to-resume">
          ← Back
        </button>
        <div class="input-actions-right">
          <button class="btn btn-secondary" id="clear-job">Clear</button>
          <button class="btn btn-primary" id="analyze-btn" disabled>
            ⚡ Analyze Resume
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initJobInput(state, navigate) {
  const textarea = document.getElementById('job-textarea');
  const charCount = document.getElementById('job-char-count');
  const analyzeBtn = document.getElementById('analyze-btn');
  const clearBtn = document.getElementById('clear-job');
  const backBtn = document.getElementById('back-to-resume');
  const loadSampleBtn = document.getElementById('load-sample-job');

  function updateState() {
    const text = textarea.value.trim();
    state.jobDescription = text;
    charCount.textContent = wordCount(text) + ' words';
    analyzeBtn.disabled = text.length < 30;
  }

  // Pre-populate if state exists
  if (state.jobDescription) {
    updateState();
  }

  textarea.addEventListener('input', updateState);

  analyzeBtn.addEventListener('click', () => {
    if (textarea.value.trim().length >= 30) {
      state.jobDescription = textarea.value.trim();
      navigate('analysis');
    }
  });

  clearBtn.addEventListener('click', () => {
    textarea.value = '';
    state.jobDescription = '';
    updateState();
    textarea.focus();
  });

  backBtn.addEventListener('click', () => navigate('resume'));

  loadSampleBtn.addEventListener('click', () => {
    const sample = `Senior Frontend Engineer - TechCo

We're looking for a Senior Frontend Engineer to lead our web platform team.

Requirements:
- 5+ years of experience with React, TypeScript, and modern frontend tooling
- Experience with state management (Redux, Zustand, or similar)
- Strong understanding of web performance optimization
- Experience with CI/CD pipelines and testing frameworks (Jest, Cypress)
- Excellent communication skills and ability to mentor junior developers
- Experience building and maintaining design systems and component libraries
- Knowledge of accessibility standards (WCAG 2.1)

Nice to have:
- Experience with Next.js or similar SSR frameworks
- GraphQL experience
- AWS or cloud platform experience
- Open source contributions

Responsibilities:
- Lead the frontend architecture for our main product platform
- Mentor and grow a team of 4 frontend engineers
- Drive performance improvements and reduce technical debt
- Collaborate with product managers and design teams on new features
- Implement and maintain CI/CD pipelines for frontend deployments
- Conduct code reviews and establish engineering best practices`;

    textarea.value = sample;
    state.jobDescription = sample;
    updateState();
  });

  textarea.focus();
}
