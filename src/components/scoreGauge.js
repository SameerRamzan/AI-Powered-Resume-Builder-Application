/* ============================================================
   ResumeAI Pro — Score Gauge Component
   Animated SVG circular progress gauge
   ============================================================ */

/**
 * Create an animated circular score gauge
 * @param {number} score - Score value (0-100)
 * @param {string} label - Label text below score
 * @param {number} size - Size in pixels (default 180)
 * @returns {string} HTML string
 */
export function createScoreGauge(score, label, size = 180) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color;
  if (score >= 80) color = 'var(--success)';
  else if (score >= 60) color = 'var(--warning)';
  else if (score >= 40) color = 'var(--primary)';
  else color = 'var(--error)';

  let grade;
  if (score >= 90) grade = 'Excellent';
  else if (score >= 80) grade = 'Great';
  else if (score >= 70) grade = 'Good';
  else if (score >= 60) grade = 'Fair';
  else if (score >= 40) grade = 'Needs Work';
  else grade = 'Poor';

  return `
    <div class="score-gauge" style="width: ${size}px; height: ${size}px;" data-score="${score}">
      <svg viewBox="0 0 120 120" width="${size}" height="${size}">
        <defs>
          <filter id="glow-${label.replace(/\s/g, '')}">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Background circle -->
        <circle
          cx="60" cy="60" r="${radius}"
          class="gauge-bg"
        />

        <!-- Score fill circle -->
        <circle
          cx="60" cy="60" r="${radius}"
          class="gauge-fill"
          style="
            stroke: ${color};
            stroke-dasharray: ${circumference};
            stroke-dashoffset: ${circumference};
            --target-offset: ${offset};
            --circumference: ${circumference};
          "
          transform="rotate(-90 60 60)"
          filter="url(#glow-${label.replace(/\s/g, '')})"
        />
      </svg>

      <div class="gauge-text">
        <span class="gauge-score" style="color: ${color};" data-target="${score}">0</span>
        <span class="gauge-label">${label}</span>
        <span class="gauge-sublabel">${grade}</span>
      </div>
    </div>
  `;
}

/**
 * Animate all score gauges on the page
 * Should be called after the gauges are inserted into DOM
 */
export function animateGauges() {
  // Animate circle fill
  setTimeout(() => {
    document.querySelectorAll('.gauge-fill').forEach(circle => {
      const targetOffset = circle.style.getPropertyValue('--target-offset');
      circle.style.strokeDashoffset = targetOffset;
    });
  }, 200);

  // Animate score number count-up
  document.querySelectorAll('.gauge-score[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    animateNumber(el, 0, target, 1200);
  });
}

/**
 * Animate a number counting up
 */
function animateNumber(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out curve
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Create a mini score bar for the breakdown cards
 */
export function createScoreBar(score, label) {
  let color;
  if (score >= 80) color = 'var(--success)';
  else if (score >= 60) color = 'var(--warning)';
  else if (score >= 40) color = 'var(--primary)';
  else color = 'var(--error)';

  return `
    <div class="score-card animate-fade-in-up">
      <div class="score-card-header">
        <span class="score-card-title">${label}</span>
        <span class="score-card-value" style="color: ${color};" data-score-target="${score}">0</span>
      </div>
      <div class="score-bar">
        <div class="score-bar-fill" style="width: 0%; background: ${color}; color: ${color};" data-width="${score}%"></div>
      </div>
    </div>
  `;
}

/**
 * Animate score bars
 */
export function animateScoreBars() {
  setTimeout(() => {
    document.querySelectorAll('.score-bar-fill[data-width]').forEach(bar => {
      bar.style.width = bar.dataset.width;
    });

    document.querySelectorAll('.score-card-value[data-score-target]').forEach(el => {
      const target = parseInt(el.dataset.scoreTarget);
      animateNumber(el, 0, target, 1000);
    });
  }, 400);
}
