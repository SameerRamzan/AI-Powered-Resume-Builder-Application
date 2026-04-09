/* ============================================================
   ResumeAI Pro — Chat Bubble Component
   ============================================================ */

import { formatAIResponse } from '../utils/helpers.js';

/**
 * Create a chat bubble
 * @param {'ai' | 'user'} role - Message sender
 * @param {string} content - Message content
 * @param {boolean} isHtml - If true, content is already HTML (skip formatting)
 * @returns {string} HTML string
 */
export function createChatBubble(role, content, isHtml = false) {
  const senderName = role === 'ai' ? '🤖 ResumeAI Coach' : '👤 You';
  const formattedContent = isHtml ? content : (role === 'ai' ? formatAIResponse(content) : `<p>${content}</p>`);

  return `
    <div class="chat-bubble chat-bubble-${role}">
      <div class="chat-sender">${senderName}</div>
      ${formattedContent}
    </div>
  `;
}

/**
 * Create a typing indicator
 * @returns {string} HTML string
 */
export function createTypingIndicator() {
  return `
    <div class="chat-bubble chat-bubble-ai typing-indicator" id="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
}

/**
 * Create the chat input area
 * @returns {string} HTML string
 */
export function createChatInput() {
  return `
    <div class="coach-input-section">
      <div class="suggestion-chips" id="suggestion-chips">
        <button class="suggestion-chip" data-suggestion="Improve my professional summary">💡 Improve my summary</button>
        <button class="suggestion-chip" data-suggestion="Strengthen my experience bullet points with metrics">📊 Add metrics to bullets</button>
        <button class="suggestion-chip" data-suggestion="What keywords am I missing for this role?">🔍 Missing keywords</button>
        <button class="suggestion-chip" data-suggestion="How can I better highlight my leadership experience?">👥 Show leadership</button>
        <button class="suggestion-chip" data-suggestion="Rewrite my skills section to match this job">🎯 Optimize skills</button>
        <button class="suggestion-chip" data-suggestion="Give me a before and after for my weakest bullet point">✨ Before & after</button>
      </div>
      <div class="chat-input-area">
        <textarea
          class="chat-input"
          id="coach-input"
          placeholder="Ask the AI coach anything about your resume..."
          rows="1"
        ></textarea>
        <button class="chat-send-btn" id="coach-send-btn" title="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  `;
}
