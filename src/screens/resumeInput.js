/* ============================================================
   ResumeAI Pro — Resume Input Screen
   ============================================================ */

import { wordCount } from '../utils/helpers.js';
import { parseResumeFile } from '../services/fileParser.js';

export function renderResumeInput(state) {
  return `
    <div class="input-screen animate-fade-in-up">
      <div class="input-screen-header">
        <h2>📄 Add Your Resume</h2>
        <p class="text-secondary">
          Upload your resume file or paste the text below. Our AI works best with detailed content.
        </p>
      </div>

      <div class="upload-container">
        <label class="input-label">Upload Resume</label>
        <div class="upload-zone" id="drop-zone">
          <input type="file" id="file-input" accept=".pdf,.docx,.txt,.rtf" style="display: none;" />
          <div class="upload-zone-icon">📁</div>
          <div class="upload-zone-text">
            <h4>Click to upload or drag and drop</h4>
            <p>PDF, DOCX, TXT, or RTF (Max 10MB)</p>
          </div>
          <div id="upload-status" class="upload-loading" style="display: none;">
            <div class="loading-spinner"></div>
            <p id="upload-status-text">Extracting text...</p>
          </div>
        </div>
      </div>

      <div class="divider"><span>OR PASTE TEXT</span></div>

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
  
  // File Upload Elements
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const uploadStatus = document.getElementById('upload-status');
  const uploadStatusText = document.getElementById('upload-status-text');

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

  /* ---- File Upload Logic ---- */
  
  dropZone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  // Drag and Drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, false);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-active'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-active'), false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const file = dt.files[0];
    if (file) handleFile(file);
  });

  async function handleFile(file) {
    try {
      uploadStatus.style.display = 'flex';
      uploadStatusText.textContent = 'Extracting text...';
      
      const result = await parseResumeFile(file);
      
      textarea.value = result.text;
      updateState();
      
      // Success animation
      uploadStatusText.textContent = 'Ready!';
      setTimeout(() => {
        uploadStatus.style.display = 'none';
      }, 800);
      
    } catch (error) {
      console.error('File parsing failed:', error);
      uploadStatusText.textContent = 'Error: ' + error.message;
      setTimeout(() => {
        uploadStatus.style.display = 'none';
      }, 3000);
    }
  }

  /* ---- Existing Events ---- */


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
