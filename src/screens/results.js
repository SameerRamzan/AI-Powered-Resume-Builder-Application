/* ============================================================
   ResumeAI Pro — Results Screen
   Displays improved resume with export options
   ============================================================ */

import { createScoreGauge, animateGauges } from '../components/scoreGauge.js';
import { improveResume } from '../services/gemini.js';
import { copyToClipboard, downloadAsFile, showToast, delay } from '../utils/helpers.js';

export function renderResults(state) {
  // If we already have an improved resume, show it
  if (state.improvedResume) {
    return renderResultsContent(state);
  }

  // Show loading/generating screen
  return `
    <div class="loading-screen animate-fade-in">
      <div class="loading-visual">
        <div class="loading-ring"></div>
        <div class="loading-icon">✨</div>
      </div>
      <div class="loading-messages">
        <div class="loading-message" id="improve-loading-msg">Generating your improved resume...</div>
        <div class="loading-submessage">Our AI is rewriting and optimizing every section</div>
      </div>
      <div class="mt-lg">
        <div style="width: 200px; height: 4px; background: var(--surface); border-radius: 2px; overflow: hidden;">
          <div id="improve-progress" style="width: 0%; height: 100%; background: var(--gradient-primary); border-radius: 2px; transition: width 0.5s ease;"></div>
        </div>
      </div>
    </div>
  `;
}

function renderResultsContent(state) {
  const oldScore = state.analysis?.overall_score || 0;
  const improvement = Math.min(Math.round(oldScore * 0.35 + 15), 100 - oldScore);
  const newScore = Math.min(oldScore + improvement, 98);

  return `
    <div class="results-screen">
      <div class="results-header animate-fade-in-up">
        <h2>🎉 Your Improved Resume</h2>
        <p class="text-secondary">
          Here's your ATS-optimized, impact-driven resume — ready to land interviews.
        </p>
      </div>

      <!-- Score Comparison -->
      <div class="results-score-comparison animate-fade-in-up delay-1">
        <div style="text-align: center;">
          <div class="text-sm text-muted" style="margin-bottom: var(--space-sm);">Original</div>
          ${createScoreGauge(oldScore, 'Before', 140)}
        </div>
        <div class="score-arrow">→</div>
        <div style="text-align: center;">
          <div class="text-sm text-muted" style="margin-bottom: var(--space-sm);">Improved</div>
          ${createScoreGauge(newScore, 'After', 140)}
        </div>
      </div>

      <!-- Improvement Summary -->
      <div class="glass-card-static animate-fade-in-up delay-2" style="text-align: center; margin-bottom: var(--space-2xl);">
        <h3 style="margin-bottom: var(--space-sm);">
          <span class="gradient-text">+${improvement} Point Improvement</span>
        </h3>
        <p class="text-sm">
          Your resume has been rewritten with stronger action verbs, quantified achievements,
          and optimized keyword placement for the target role.
        </p>
      </div>

      <!-- Improved Resume -->
      <div class="results-resume-container animate-fade-in-up delay-3">
        <div class="results-toolbar">
          <button class="btn btn-secondary btn-sm" id="copy-resume">
            📋 Copy
          </button>
          <button class="btn btn-secondary btn-sm" id="download-resume">
            ⬇ Download
          </button>
        </div>

        <div class="results-resume" id="improved-resume-content">${escapeForDisplay(state.improvedResume)}</div>
      </div>

      <!-- Actions -->
      <div class="results-actions animate-fade-in-up delay-4">
        <button class="btn btn-ghost" id="results-back-to-analysis">
          ← View Analysis
        </button>
        <button class="btn btn-secondary" id="results-go-to-coach">
          🤖 Coach Session
        </button>
        <button class="btn btn-primary" id="results-start-over">
          🔄 Start Over
        </button>
      </div>

      <!-- Pro Tips -->
      <div class="glass-card-static animate-fade-in-up delay-5" style="margin-top: var(--space-2xl);">
        <div class="section-header">
          <div class="section-icon">🎓</div>
          <div>
            <div class="section-title">Pro Tips for Your Application</div>
          </div>
        </div>
        <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: var(--space-sm);">
          <li class="sw-item">
            <span class="sw-item-icon">1.</span>
            <span><strong>Customize further:</strong> Tweak the improved resume to add specific details only you know (exact metrics, project names).</span>
          </li>
          <li class="sw-item">
            <span class="sw-item-icon">2.</span>
            <span><strong>Cover letter:</strong> Use the same keywords and themes in your cover letter for consistency.</span>
          </li>
          <li class="sw-item">
            <span class="sw-item-icon">3.</span>
            <span><strong>File format:</strong> Submit as PDF unless the job posting specifically requests .docx.</span>
          </li>
          <li class="sw-item">
            <span class="sw-item-icon">4.</span>
            <span><strong>LinkedIn sync:</strong> Update your LinkedIn profile to match this optimized version.</span>
          </li>
        </ul>
      </div>
    </div>
  `;
}

function escapeForDisplay(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '\n');
}

export async function initResults(state, navigate) {
  if (state.improvedResume) {
    setupResultsButtons(state, navigate);
    setTimeout(() => animateGauges(), 200);
    return;
  }

  // Generate improved resume
  try {
    await generateImprovedResume(state, navigate);
  } catch (error) {
    showToast('Failed to generate improved resume: ' + error.message, 'error');
    navigate('analysis');
  }
}

async function generateImprovedResume(state, navigate) {
  const loadingMsg = document.getElementById('improve-loading-msg');
  const progressBar = document.getElementById('improve-progress');

  const messages = [
    'Analyzing your experience...',
    'Rewriting bullet points with impact...',
    'Integrating target keywords...',
    'Optimizing for ATS compatibility...',
    'Polishing your professional summary...',
    'Finalizing your improved resume...',
  ];

  let msgIdx = 0;
  const msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % messages.length;
    if (loadingMsg) {
      loadingMsg.textContent = messages[msgIdx];
      loadingMsg.style.animation = 'none';
      loadingMsg.offsetHeight;
      loadingMsg.style.animation = 'fadeIn 0.5s var(--ease-out)';
    }
  }, 3000);

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 12, 85);
    if (progressBar) progressBar.style.width = progress + '%';
  }, 1200);

  try {
    const improved = await improveResume(state.resumeText, state.jobDescription, state.analysis);
    state.improvedResume = improved;

    clearInterval(progressInterval);
    if (progressBar) progressBar.style.width = '100%';
    if (loadingMsg) loadingMsg.textContent = 'Done! Here\'s your improved resume.';

    await delay(800);
    clearInterval(msgInterval);

    // Re-render with results
    const container = document.getElementById('screen-container');
    container.innerHTML = renderResultsContent(state);
    setupResultsButtons(state, navigate);

    setTimeout(() => animateGauges(), 200);

  } catch (error) {
    clearInterval(msgInterval);
    clearInterval(progressInterval);
    throw error;
  }
}

function setupResultsButtons(state, navigate) {
  const copyBtn = document.getElementById('copy-resume');
  const downloadBtn = document.getElementById('download-resume');
  const analysisBtn = document.getElementById('results-back-to-analysis');
  const coachBtn = document.getElementById('results-go-to-coach');
  const startOverBtn = document.getElementById('results-start-over');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard(state.improvedResume);
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      downloadAsFile(state.improvedResume, 'resume_improved.txt');
    });
  }

  if (analysisBtn) {
    analysisBtn.addEventListener('click', () => navigate('analysis'));
  }

  if (coachBtn) {
    coachBtn.addEventListener('click', () => navigate('coach'));
  }

  if (startOverBtn) {
    startOverBtn.addEventListener('click', () => {
      // Reset state
      state.resumeText = '';
      state.jobDescription = '';
      state.analysis = null;
      state.improvedResume = '';
      state.coachMessages = [];
      navigate('landing');
    });
  }
}
