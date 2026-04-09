/* ============================================================
   ResumeAI Pro — Before/After Comparison Component
   ============================================================ */

/**
 * Create a before/after comparison card
 * @param {string} beforeText - Original text
 * @param {string} afterText - Improved text
 * @param {string} context - Optional context label (e.g., "Experience Bullet")
 * @returns {string} HTML string
 */
export function createBeforeAfter(beforeText, afterText, context = '') {
  return `
    <div class="before-after-container animate-fade-in-up">
      ${context ? `<div class="before-after-context" style="grid-column: 1 / -1; margin-bottom: var(--space-sm);">
        <span class="chip chip-neutral">${context}</span>
      </div>` : ''}
      <div class="before-card">
        <div class="before-after-label">
          <span>✕</span> Before
        </div>
        <div class="before-after-text">${beforeText}</div>
      </div>
      <div class="after-card">
        <div class="before-after-label">
          <span>✓</span> After
        </div>
        <div class="before-after-text">${afterText}</div>
      </div>
    </div>
  `;
}

/**
 * Example transformations used in landing page and coach screen
 */
export const EXAMPLE_TRANSFORMATIONS = [
  {
    context: 'Experience Bullet — Engineering',
    before: 'Responsible for managing a team and building web applications',
    after: 'Led a cross-functional team of 8 engineers, delivering 3 major product launches on time and 15% under budget, increasing platform revenue by $1.2M annually',
  },
  {
    context: 'Experience Bullet — Marketing',
    before: 'Helped with marketing campaigns and social media',
    after: 'Spearheaded 12 data-driven marketing campaigns across 4 channels, generating $2.4M in pipeline revenue and increasing qualified lead conversion by 34%',
  },
  {
    context: 'Experience Bullet — Data/Analytics',
    before: 'Did data analysis and created reports',
    after: 'Engineered automated data pipelines processing 500K+ daily records using Python and SQL, reducing reporting time by 60% and enabling real-time executive decision-making',
  },
  {
    context: 'Summary Statement',
    before: 'Experienced software developer looking for a new opportunity. Good at coding and problem solving.',
    after: 'Results-driven Software Engineer with 5+ years of experience building scalable web applications using React, Node.js, and TypeScript. Proven track record of improving system performance by 40% and mentoring junior developers at high-growth startups.',
  },
];
