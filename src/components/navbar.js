/* ============================================================
   ResumeAI Pro — Navbar Component
   ============================================================ */

const STEPS = [
  { id: 'resume', label: 'Resume' },
  { id: 'job', label: 'Job' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'coach', label: 'Coach' },
  { id: 'results', label: 'Results' },
];

const STEP_ORDER = { landing: -1, resume: 0, job: 1, analysis: 2, coach: 3, results: 4 };

export function renderNavbar(currentScreen) {
  const currentIdx = STEP_ORDER[currentScreen] ?? -1;
  const showProgress = currentIdx >= 0;

  return `
    <div class="navbar">
      <a class="navbar-brand" data-navigate="landing" id="nav-brand">
        <div class="navbar-logo">R</div>
        <div class="navbar-title">Resume<span>AI</span> Pro</div>
      </a>
      ${showProgress ? `
        <div class="progress-stepper">
          ${STEPS.map((step, idx) => `
            <div class="progress-step ${idx === currentIdx ? 'active' : ''} ${idx < currentIdx ? 'completed' : ''}">
              <div class="progress-dot ${idx === currentIdx ? 'active' : ''} ${idx < currentIdx ? 'completed' : ''}"></div>
              <span class="progress-label">${step.label}</span>
            </div>
            ${idx < STEPS.length - 1 ? `<div class="progress-line ${idx < currentIdx ? 'completed' : ''}"></div>` : ''}
          `).join('')}
        </div>
      ` : '<div></div>'}
    </div>
  `;
}
