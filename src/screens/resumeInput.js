/* ============================================================
   ResumeAI Pro — Resume Input Screen
   ============================================================ */

import { wordCount } from '../utils/helpers.js';

export function renderResumeInput(state) {
  return `
    <div class="input-screen animate-fade-in-up">
      <div class="input-screen-header">
        <h2>📄 Paste Your Resume</h2>
        <p class="text-secondary">
          Paste your current resume text below. Don't worry about formatting —
          our AI will analyze the content and structure.
        </p>
      </div>

      <div class="input-group">
        <label class="input-label" for="resume-textarea">Resume Content</label>
        <textarea
          class="input-field"
          id="resume-textarea"
          placeholder="Paste your entire resume here...

Example:
John Doe
Software Engineer
john@email.com | (555) 123-4567

Summary:
Experienced software engineer with 5+ years...

Experience:
Software Engineer | Company Name | 2020 - Present
- Built and deployed web applications...
- Led a team of 3 developers..."
          style="min-height: 380px; font-size: var(--font-sm);"
        >${state.resumeText || ''}</textarea>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="char-count" id="resume-char-count">
            ${state.resumeText ? wordCount(state.resumeText) + ' words' : '0 words'}
          </span>
          <button class="btn btn-ghost btn-sm" id="load-sample-resume">
            📋 Load Sample Resume
          </button>
        </div>
      </div>

      <div class="input-tips">
        <div class="input-tips-title">
          💡 Tips for Best Results
        </div>
        <ul>
          <li>Include all sections: Summary, Experience, Education, Skills</li>
          <li>Copy-paste directly from your resume document (Word, PDF text, etc.)</li>
          <li>Include job titles, company names, and dates for each position</li>
          <li>Don't worry about formatting — the AI focuses on content quality</li>
          <li>More detail = better analysis. Include all your bullet points.</li>
        </ul>
      </div>

      <div class="input-actions">
        <button class="btn btn-ghost" data-navigate="landing" id="back-to-landing">
          ← Back
        </button>
        <div class="input-actions-right">
          <button class="btn btn-secondary" id="clear-resume">Clear</button>
          <button class="btn btn-primary" id="next-to-job" disabled>
            Next: Job Description →
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initResumeInput(state, navigate) {
  const textarea = document.getElementById('resume-textarea');
  const charCount = document.getElementById('resume-char-count');
  const nextBtn = document.getElementById('next-to-job');
  const clearBtn = document.getElementById('clear-resume');
  const backBtn = document.getElementById('back-to-landing');
  const loadSampleBtn = document.getElementById('load-sample-resume');

  function updateState() {
    const text = textarea.value.trim();
    state.resumeText = text;
    charCount.textContent = wordCount(text) + ' words';
    nextBtn.disabled = text.length < 50;
  }

  // Pre-populate if state exists
  if (state.resumeText) {
    updateState();
  }

  textarea.addEventListener('input', updateState);

  nextBtn.addEventListener('click', () => {
    if (textarea.value.trim().length >= 50) {
      state.resumeText = textarea.value.trim();
      navigate('job');
    }
  });

  clearBtn.addEventListener('click', () => {
    textarea.value = '';
    state.resumeText = '';
    updateState();
    textarea.focus();
  });

  backBtn.addEventListener('click', () => navigate('landing'));

  loadSampleBtn.addEventListener('click', () => {
    const sample = `JOHN DOE
Software Developer
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

SUMMARY
Experienced software developer with 5 years of experience in web development. Good at coding and problem solving. Looking for a new opportunity to grow.

EXPERIENCE

Software Developer | ABC Corp | 2020 - Present
- Responsible for building web applications
- Worked with the team on various projects
- Fixed bugs and helped with code reviews
- Used React and Node.js for development
- Attended daily standup meetings

Junior Developer | XYZ Inc | 2018 - 2020
- Helped senior developers with tasks
- Did testing and documentation
- Learned new technologies
- Participated in team activities

EDUCATION
B.S. Computer Science | State University | 2018

SKILLS
JavaScript, React, Node.js, HTML, CSS, Git, SQL, Python`;

    textarea.value = sample;
    state.resumeText = sample;
    updateState();
  });

  // Auto-focus
  textarea.focus();
}
