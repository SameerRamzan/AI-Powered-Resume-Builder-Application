/* ============================================================
   ResumeAI Pro — Landing Screen
   ============================================================ */

import { createBeforeAfter, EXAMPLE_TRANSFORMATIONS } from '../components/beforeAfter.js';

export function renderLanding() {
  const example = EXAMPLE_TRANSFORMATIONS[0];

  return `
    <div class="landing-screen">
      <!-- Floating Orbs -->
      <div class="hero-orbs">
        <div class="hero-orb hero-orb-1"></div>
        <div class="hero-orb hero-orb-2"></div>
        <div class="hero-orb hero-orb-3"></div>
      </div>

      <!-- Badge -->
      <div class="hero-badge">
        <span class="hero-badge-dot"></span>
        Powered by Google Gemini AI
      </div>

      <!-- Hero Title -->
      <h1 class="hero-title">
        Your AI <span class="gradient-text">Resume Coach</span>
      </h1>

      <!-- Subtitle -->
      <p class="hero-subtitle">
        Get expert-level resume coaching powered by AI. Optimize for ATS, strengthen your impact,
        and land more interviews — all in minutes, not hours.
      </p>

      <!-- CTA -->
      <div class="hero-cta-group">
        <button class="btn btn-primary btn-lg" id="cta-start" data-navigate="resume">
          ✨ Build Your Resume
        </button>
        <button class="btn btn-secondary btn-lg" id="cta-demo" data-action="demo">
          ▶ Try Demo
        </button>
      </div>

      <!-- Feature Cards -->
      <div class="hero-features">
        <div class="feature-card animate-fade-in-up delay-4">
          <div class="feature-icon feature-icon-purple">🎯</div>
          <h3 class="feature-title">ATS Optimization</h3>
          <p class="feature-desc">
            Smart keyword matching ensures your resume passes applicant tracking systems
            and reaches human recruiters.
          </p>
        </div>

        <div class="feature-card animate-fade-in-up delay-5">
          <div class="feature-icon feature-icon-teal">🤖</div>
          <h3 class="feature-title">AI Coaching</h3>
          <p class="feature-desc">
            Interactive coaching from an AI trained on 10,000+ successful resumes.
            Get specific, actionable improvements.
          </p>
        </div>

        <div class="feature-card animate-fade-in-up delay-6">
          <div class="feature-icon feature-icon-blue">📊</div>
          <h3 class="feature-title">Impact Scoring</h3>
          <p class="feature-desc">
            Real-time scoring across 4 dimensions: keywords, impact, clarity, and relevance.
            Know exactly where to improve.
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-bar animate-fade-in-up delay-7">
        <div class="stat-item">
          <div class="stat-value gradient-text">4x</div>
          <div class="stat-label">More Interviews</div>
        </div>
        <div class="stat-item">
          <div class="stat-value gradient-text">85%</div>
          <div class="stat-label">ATS Pass Rate</div>
        </div>
        <div class="stat-item">
          <div class="stat-value gradient-text">2 min</div>
          <div class="stat-label">Avg. Analysis Time</div>
        </div>
      </div>

      <!-- Before/After Example -->
      <div style="width: 100%; max-width: 800px; margin-top: var(--space-3xl);">
        <h3 class="text-center animate-fade-in-up delay-7" style="margin-bottom: var(--space-lg);">
          See the <span class="gradient-text">Difference</span>
        </h3>
        <div class="animate-fade-in-up delay-8">
          ${createBeforeAfter(example.before, example.after, example.context)}
        </div>
      </div>
    </div>
  `;
}

export function initLanding(state, navigate) {
  // Start button
  const startBtn = document.getElementById('cta-start');
  if (startBtn) {
    startBtn.addEventListener('click', () => navigate('resume'));
  }

  // Demo button
  const demoBtn = document.getElementById('cta-demo');
  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      // Load sample data and navigate
      const { SAMPLE_RESUME, SAMPLE_JOB } = require_samples();
      state.resumeText = SAMPLE_RESUME;
      state.jobDescription = SAMPLE_JOB;
      navigate('resume');
    });
  }
}

function require_samples() {
  // Inline import to avoid circular dependency
  return {
    SAMPLE_RESUME: `JOHN DOE
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
JavaScript, React, Node.js, HTML, CSS, Git, SQL, Python`,

    SAMPLE_JOB: `Senior Frontend Engineer - TechCo

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
- Conduct code reviews and establish engineering best practices`,
  };
}
