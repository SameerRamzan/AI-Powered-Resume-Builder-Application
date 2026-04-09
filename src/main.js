/* ============================================================
   ResumeAI Pro — Main Application Entry Point
   Router, state management, and screen orchestration
   ============================================================ */

import { renderNavbar } from './components/navbar.js';
import { renderLanding, initLanding } from './screens/landing.js';
import { renderResumeInput, initResumeInput } from './screens/resumeInput.js';
import { renderJobInput, initJobInput } from './screens/jobInput.js';
import { renderAnalysis, initAnalysis } from './screens/analysis.js';
import { renderCoach, initCoach } from './screens/coach.js';
import { renderResults, initResults } from './screens/results.js';
import { save, load } from './utils/storage.js';

/* ---- Application State ---- */
const state = {
  currentScreen: 'landing',
  resumeText: load('resumeText', ''),
  jobDescription: load('jobDescription', ''),
  analysis: load('analysis', null),
  improvedResume: load('improvedResume', ''),
  coachMessages: load('coachMessages', []),
};

/* ---- Screen Registry ---- */
const screens = {
  landing: { render: renderLanding, init: initLanding },
  resume:  { render: renderResumeInput, init: initResumeInput },
  job:     { render: renderJobInput, init: initJobInput },
  analysis:{ render: renderAnalysis, init: initAnalysis },
  coach:   { render: renderCoach, init: initCoach },
  results: { render: renderResults, init: initResults },
};

/* ---- Navigation ---- */
function navigate(screenId) {
  if (!screens[screenId]) {
    console.warn('Unknown screen:', screenId);
    return;
  }

  // Persist state on navigation
  persistState();

  state.currentScreen = screenId;

  const container = document.getElementById('screen-container');
  const navbar = document.getElementById('navbar');

  // Update navbar
  navbar.innerHTML = renderNavbar(screenId);

  // Render new screen with transition
  container.classList.remove('screen-enter');
  container.classList.add('screen-exit');

  setTimeout(() => {
    container.innerHTML = screens[screenId].render(state);
    container.classList.remove('screen-exit');
    container.classList.add('screen-enter');

    // Initialize screen interactivity
    screens[screenId].init(state, navigate);

    // Remove animation class after it completes
    setTimeout(() => container.classList.remove('screen-enter'), 500);
  }, 200);

  // Update URL hash
  if (window.location.hash !== '#' + screenId) {
    history.pushState(null, '', '#' + screenId);
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- State Persistence ---- */
function persistState() {
  save('resumeText', state.resumeText);
  save('jobDescription', state.jobDescription);
  save('analysis', state.analysis);
  save('improvedResume', state.improvedResume);
  save('coachMessages', state.coachMessages);
}

// Persist on page unload
window.addEventListener('beforeunload', persistState);

/* ---- Hash-Based Routing ---- */
window.addEventListener('popstate', () => {
  const hash = window.location.hash.slice(1) || 'landing';
  if (screens[hash] && hash !== state.currentScreen) {
    navigate(hash);
  }
});

/* ---- Global Click Delegation ---- */
document.addEventListener('click', (e) => {
  // Handle data-navigate attributes
  const navTarget = e.target.closest('[data-navigate]');
  if (navTarget) {
    e.preventDefault();
    const target = navTarget.dataset.navigate;
    navigate(target);
  }
});

/* ---- Initialize App ---- */
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.slice(1);

  // Determine initial screen
  let initialScreen = 'landing';
  if (hash && screens[hash]) {
    initialScreen = hash;
  }

  // Render initial screen
  navigate(initialScreen);

  console.log(
    '%c🚀 ResumeAI Pro',
    'font-size: 20px; font-weight: bold; color: #7c5cf7; text-shadow: 0 0 10px rgba(124, 92, 247, 0.5);'
  );
  console.log(
    '%cAI-Powered Resume Coach — Built with Google Gemini',
    'font-size: 12px; color: #2dd4a8;'
  );
});
