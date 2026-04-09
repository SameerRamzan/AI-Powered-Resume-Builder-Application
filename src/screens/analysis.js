/* ============================================================
   ResumeAI Pro — Analysis Dashboard Screen
   Shows ATS scoring, keyword analysis, and improvement areas
   ============================================================ */

import { createScoreGauge, animateGauges, createScoreBar, animateScoreBars } from '../components/scoreGauge.js';
import { analyzeResume } from '../services/gemini.js';
import { calculateLocalScores } from '../services/analyzer.js';
import { showToast, LOADING_MESSAGES, delay } from '../utils/helpers.js';

export function renderAnalysis(state) {
  // If we already have analysis, show it
  if (state.analysis) {
    return renderAnalysisResults(state);
  }

  // Show loading screen
  return `
    <div class="loading-screen animate-fade-in">
      <div class="loading-visual">
        <div class="loading-ring"></div>
        <div class="loading-icon">🧠</div>
      </div>
      <div class="loading-messages">
        <div class="loading-message" id="loading-msg">Preparing analysis...</div>
        <div class="loading-submessage" id="loading-submsg">This usually takes 15-30 seconds</div>
      </div>
      <div class="mt-lg">
        <div style="width: 200px; height: 4px; background: var(--surface); border-radius: 2px; overflow: hidden;">
          <div id="loading-progress" style="width: 0%; height: 100%; background: var(--gradient-primary); border-radius: 2px; transition: width 0.5s ease;"></div>
        </div>
      </div>
    </div>
  `;
}

function renderAnalysisResults(state) {
  const a = state.analysis;

  return `
    <div class="analysis-screen">
      <div class="analysis-header animate-fade-in-up">
        <h2>📊 Resume Analysis</h2>
        <p class="text-secondary">Here's how your resume scores against the target job description</p>
      </div>

      <!-- Overall Score -->
      <div class="overall-score-section animate-fade-in-up delay-1">
        ${createScoreGauge(a.overall_score, 'Overall', 200)}
      </div>

      <!-- Score Breakdown -->
      <div class="score-breakdown">
        ${createScoreBar(a.keyword_score, '🔍 Keywords')}
        ${createScoreBar(a.impact_score, '💪 Impact')}
        ${createScoreBar(a.clarity_score, '✍️ Clarity')}
        ${createScoreBar(a.relevance_score, '🎯 Relevance')}
      </div>

      <!-- Keywords -->
      <div class="keywords-section glass-card-static animate-fade-in-up delay-2">
        <div class="section-header">
          <div class="section-icon">🔑</div>
          <div>
            <div class="section-title">Keyword Analysis</div>
            <div class="section-subtitle">How your resume matches the job requirements</div>
          </div>
        </div>

        <div class="keywords-columns">
          <div class="keyword-column">
            <h4><span style="color: var(--success);">✓</span> Matched Keywords (${a.matched_keywords?.length || 0})</h4>
            <div class="keyword-grid">
              ${(a.matched_keywords || []).map(k => `<span class="chip chip-success">${k}</span>`).join('')}
              ${(!a.matched_keywords?.length) ? '<span class="text-muted text-sm">No matches found</span>' : ''}
            </div>
          </div>

          <div class="keyword-column">
            <h4><span style="color: var(--error);">✕</span> Missing Keywords (${a.missing_keywords?.length || 0})</h4>
            <div class="keyword-grid">
              ${(a.missing_keywords || []).map(k => `<span class="chip chip-error">${k}</span>`).join('')}
              ${(!a.missing_keywords?.length) ? '<span class="text-muted text-sm">Great — no critical gaps!</span>' : ''}
            </div>
          </div>
        </div>
      </div>

      <!-- Strengths & Weaknesses -->
      <div class="strengths-weaknesses animate-fade-in-up delay-3">
        <div class="glass-card-static">
          <h3 style="color: var(--success); margin-bottom: var(--space-md); font-size: var(--font-lg);">
            ✓ Strengths
          </h3>
          <ul class="sw-list">
            ${(a.strengths || []).map(s => `
              <li class="sw-item">
                <span class="sw-item-icon" style="color: var(--success);">●</span>
                <span>${s}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="glass-card-static">
          <h3 style="color: var(--warning); margin-bottom: var(--space-md); font-size: var(--font-lg);">
            △ Areas to Improve
          </h3>
          <ul class="sw-list">
            ${(a.weaknesses || []).map(w => `
              <li class="sw-item">
                <span class="sw-item-icon" style="color: var(--warning);">●</span>
                <span>${w}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Quick Wins -->
      ${a.quick_wins?.length ? `
        <div class="quick-wins animate-fade-in-up delay-4">
          <div class="section-header">
            <div class="section-icon">⚡</div>
            <div>
              <div class="section-title">Quick Wins</div>
              <div class="section-subtitle">High-impact changes you can make right now</div>
            </div>
          </div>

          ${a.quick_wins.map((qw, i) => `
            <div class="quick-win-card">
              <div class="quick-win-number">${i + 1}</div>
              <div class="quick-win-content">
                <h4>${qw.title}</h4>
                <p>${qw.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Section Feedback -->
      ${a.section_feedback ? `
        <div class="glass-card-static animate-fade-in-up delay-5" style="margin-bottom: var(--space-2xl);">
          <div class="section-header">
            <div class="section-icon">📝</div>
            <div>
              <div class="section-title">Section-by-Section Feedback</div>
            </div>
          </div>

          ${Object.entries(a.section_feedback).map(([section, feedback]) => `
            <div style="margin-bottom: var(--space-md); padding-bottom: var(--space-md); border-bottom: 1px solid var(--border);">
              <h4 style="text-transform: capitalize; margin-bottom: var(--space-xs); font-size: var(--font-base);">
                ${section.replace('_', ' ')}
              </h4>
              <p style="font-size: var(--font-sm);">${feedback}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Action Buttons -->
      <div class="analysis-actions animate-fade-in-up delay-6">
        <button class="btn btn-secondary" id="back-to-job">
          ← Edit Inputs
        </button>
        <button class="btn btn-accent" id="go-to-coach">
          🤖 Get AI Coaching
        </button>
        <button class="btn btn-primary" id="generate-improved">
          ✨ Generate Improved Resume
        </button>
      </div>
    </div>
  `;
}

export async function initAnalysis(state, navigate) {
  if (state.analysis) {
    // Results already loaded — set up buttons and animate
    setupAnalysisButtons(state, navigate);
    setTimeout(() => {
      animateGauges();
      animateScoreBars();
    }, 100);
    return;
  }

  // Run AI analysis
  try {
    await runAnalysis(state, navigate);
  } catch (error) {
    showToast(error.message || 'Analysis failed. Please try again.', 'error');
    navigate('job');
  }
}

async function runAnalysis(state, navigate) {
  const loadingMsg = document.getElementById('loading-msg');
  const loadingSubmsg = document.getElementById('loading-submsg');
  const progressBar = document.getElementById('loading-progress');

  // Cycle loading messages
  let msgIndex = 0;
  const msgInterval = setInterval(() => {
    msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
    const msg = LOADING_MESSAGES[msgIndex];
    if (loadingMsg) {
      loadingMsg.textContent = msg.text;
      loadingMsg.style.animation = 'none';
      loadingMsg.offsetHeight; // force reflow
      loadingMsg.style.animation = 'fadeIn 0.5s var(--ease-out)';
    }
  }, 2500);

  // Animate progress bar
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress = Math.min(progress + Math.random() * 15, 85);
    if (progressBar) progressBar.style.width = progress + '%';
  }, 1000);

  try {
    // Run AI analysis
    const analysis = await analyzeResume(state.resumeText, state.jobDescription);
    state.analysis = analysis;

    // Complete progress
    clearInterval(progressInterval);
    if (progressBar) progressBar.style.width = '100%';

    if (loadingMsg) loadingMsg.textContent = 'Analysis complete!';
    if (loadingSubmsg) loadingSubmsg.textContent = 'Rendering your results...';

    await delay(600);
    clearInterval(msgInterval);

    // Re-render with results
    const container = document.getElementById('screen-container');
    container.innerHTML = renderAnalysisResults(state);
    setupAnalysisButtons(state, navigate);

    setTimeout(() => {
      animateGauges();
      animateScoreBars();
    }, 200);

  } catch (error) {
    clearInterval(msgInterval);
    clearInterval(progressInterval);

    console.error('Analysis error:', error);

    // Fallback to local analysis
    if (loadingMsg) loadingMsg.textContent = 'Using local analysis...';
    await delay(1000);

    const localScores = calculateLocalScores(state.resumeText, state.jobDescription);
    state.analysis = {
      overall_score: Math.round((localScores.keyword + localScores.impact + localScores.clarity + localScores.relevance) / 4),
      keyword_score: localScores.keyword,
      impact_score: localScores.impact,
      clarity_score: localScores.clarity,
      relevance_score: localScores.relevance,
      matched_keywords: localScores.matched,
      missing_keywords: localScores.missing,
      strengths: ['Resume has identifiable sections', 'Contact information is present'],
      weaknesses: ['AI analysis unavailable — showing local estimates', 'Check your API key configuration for full analysis'],
      quick_wins: [
        { title: 'Add quantified metrics', description: 'Include numbers, percentages, and dollar amounts in your bullet points to demonstrate impact.' },
        { title: 'Use action verbs', description: 'Start each bullet with a strong action verb like "Led", "Engineered", "Delivered".' },
        { title: 'Add missing keywords', description: `Consider adding: ${localScores.missing.slice(0, 5).join(', ')}` },
      ],
      section_feedback: null,
    };

    const container = document.getElementById('screen-container');
    container.innerHTML = renderAnalysisResults(state);
    setupAnalysisButtons(state, navigate);

    setTimeout(() => {
      animateGauges();
      animateScoreBars();
    }, 200);

    showToast('Using local analysis (AI unavailable). Check API key for full analysis.', 'info', 5000);
  }
}

function setupAnalysisButtons(state, navigate) {
  const backBtn = document.getElementById('back-to-job');
  const coachBtn = document.getElementById('go-to-coach');
  const improveBtn = document.getElementById('generate-improved');

  if (backBtn) backBtn.addEventListener('click', () => {
    state.analysis = null; // Reset so it re-analyzes
    navigate('job');
  });

  if (coachBtn) coachBtn.addEventListener('click', () => navigate('coach'));

  if (improveBtn) improveBtn.addEventListener('click', () => navigate('results'));
}
