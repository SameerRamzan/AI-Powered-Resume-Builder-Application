/* Helper utilities for ResumeAI Pro */

/**
 * Show a toast notification
 */
export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${escapeHtml(message)}`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format a Markdown-like AI response into HTML
 * Supports: **bold**, *italic*, bullet lists, numbered lists, and line breaks
 */
export function formatAIResponse(text) {
  if (!text) return '';

  let html = escapeHtml(text);

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Convert line breaks into structured content
  const lines = html.split('\n');
  let result = '';
  let inList = false;
  let listType = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      if (!inList || listType !== 'ul') {
        if (inList) result += `</${listType}>`;
        result += '<ul>';
        inList = true;
        listType = 'ul';
      }
      result += `<li>${trimmed.slice(2)}</li>`;
    }
    // Numbered list
    else if (/^\d+[\.\)] /.test(trimmed)) {
      if (!inList || listType !== 'ol') {
        if (inList) result += `</${listType}>`;
        result += '<ol>';
        inList = true;
        listType = 'ol';
      }
      result += `<li>${trimmed.replace(/^\d+[\.\)] /, '')}</li>`;
    }
    // Regular text
    else {
      if (inList) {
        result += `</${listType}>`;
        inList = false;
      }
      if (trimmed === '') {
        result += '<br/>';
      } else {
        result += `<p>${trimmed}</p>`;
      }
    }
  }
  if (inList) result += `</${listType}>`;

  return result;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
    return true;
  } catch {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Copied to clipboard!', 'success');
    return true;
  }
}

/**
 * Download text as a file
 */
export function downloadAsFile(text, filename = 'resume.txt') {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`, 'success');
}

/**
 * Debounce function
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Count words in text
 */
export function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Truncate text
 */
export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Delay / sleep
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Rotating loading messages for the analysis screen
 */
export const LOADING_MESSAGES = [
  { text: 'Scanning your resume...', icon: '📄' },
  { text: 'Analyzing keywords...', icon: '🔍' },
  { text: 'Evaluating impact statements...', icon: '💪' },
  { text: 'Checking ATS compatibility...', icon: '🤖' },
  { text: 'Comparing with job requirements...', icon: '🎯' },
  { text: 'Scoring your resume...', icon: '📊' },
  { text: 'Identifying improvement areas...', icon: '✨' },
  { text: 'Preparing your analysis...', icon: '📋' },
];

/**
 * Sample resume for demo purposes
 */
export const SAMPLE_RESUME = `JOHN DOE
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

/**
 * Sample job description for demo purposes
 */
export const SAMPLE_JOB = `Senior Frontend Engineer - TechCo

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
