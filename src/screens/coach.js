/* ============================================================
   ResumeAI Pro — AI Coach Screen
   Interactive chat-based coaching with the AI
   ============================================================ */

import { createChatBubble, createTypingIndicator, createChatInput } from '../components/chatBubble.js';
import { coachChat } from '../services/gemini.js';
import { showToast } from '../utils/helpers.js';

export function renderCoach(state) {
  return `
    <div class="coach-screen">
      <div class="coach-header animate-fade-in-up">
        <h2>🤖 AI Resume Coach</h2>
        <p class="text-secondary">
          Chat with your AI coach to get specific improvements. Ask anything about your resume!
        </p>
      </div>

      <div class="chat-container coach-messages" id="coach-messages">
        ${renderExistingMessages(state)}
      </div>

      ${createChatInput()}

      <div style="display: flex; justify-content: space-between; margin-top: var(--space-md);">
        <button class="btn btn-ghost btn-sm" id="back-to-analysis">← Back to Analysis</button>
        <button class="btn btn-primary btn-sm" id="go-to-results">Generate Improved Resume →</button>
      </div>
    </div>
  `;
}

function renderExistingMessages(state) {
  if (state.coachMessages.length === 0) {
    // Initial welcome message
    return createChatBubble('ai', getWelcomeMessage(state), true);
  }

  let html = createChatBubble('ai', getWelcomeMessage(state), true);
  for (const msg of state.coachMessages) {
    html += createChatBubble(msg.role === 'user' ? 'user' : 'ai', msg.content);
  }
  return html;
}

function getWelcomeMessage(state) {
  const score = state.analysis?.overall_score || '?';
  const topWeakness = state.analysis?.weaknesses?.[0] || 'some areas that need attention';
  const topStrength = state.analysis?.strengths?.[0] || 'a solid foundation';

  return `
    <p>👋 <strong>Welcome to your coaching session!</strong></p>
    <p>I've reviewed your resume (score: <strong>${score}/100</strong>) and the target job description. Here's what I see:</p>
    <ul>
      <li><strong>Strength:</strong> ${topStrength}</li>
      <li><strong>Top priority:</strong> ${topWeakness}</li>
    </ul>
    <p>I can help you with:</p>
    <ul>
      <li>✍️ Rewriting weak bullet points with impact metrics</li>
      <li>🔍 Adding missing keywords naturally</li>
      <li>📝 Improving your professional summary</li>
      <li>🎯 Tailoring your experience for this specific role</li>
      <li>💡 Any other resume questions!</li>
    </ul>
    <p>What would you like to work on first? Try clicking a suggestion below, or type your own question!</p>
  `;
}

export function initCoach(state, navigate) {
  const messagesContainer = document.getElementById('coach-messages');
  const input = document.getElementById('coach-input');
  const sendBtn = document.getElementById('coach-send-btn');
  const backBtn = document.getElementById('back-to-analysis');
  const resultsBtn = document.getElementById('go-to-results');
  const suggestionsContainer = document.getElementById('suggestion-chips');

  let isProcessing = false;

  // Scroll to bottom
  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  scrollToBottom();

  // Send message
  async function sendMessage(text) {
    if (!text.trim() || isProcessing) return;

    isProcessing = true;
    sendBtn.disabled = true;
    input.value = '';

    // Add user message
    state.coachMessages.push({ role: 'user', content: text.trim() });
    messagesContainer.innerHTML += createChatBubble('user', text.trim());
    scrollToBottom();

    // Show typing indicator
    messagesContainer.innerHTML += createTypingIndicator();
    scrollToBottom();

    try {
      const response = await coachChat(state.coachMessages, {
        resumeText: state.resumeText,
        jobDescription: state.jobDescription,
        analysis: state.analysis,
      });

      // Remove typing indicator
      const typingEl = document.getElementById('typing-indicator');
      if (typingEl) typingEl.remove();

      // Add AI response
      state.coachMessages.push({ role: 'assistant', content: response });
      messagesContainer.innerHTML += createChatBubble('ai', response);
      scrollToBottom();

    } catch (error) {
      const typingEl = document.getElementById('typing-indicator');
      if (typingEl) typingEl.remove();

      const errorMsg = 'Sorry, I encountered an error. Please try again. (' + error.message + ')';
      messagesContainer.innerHTML += createChatBubble('ai', errorMsg);
      scrollToBottom();

      showToast('Coach error: ' + error.message, 'error');
    }

    isProcessing = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // Send button click
  sendBtn.addEventListener('click', () => sendMessage(input.value));

  // Enter to send (Shift+Enter for new line)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  // Suggestion chips
  suggestionsContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.suggestion-chip');
    if (chip) {
      const suggestion = chip.dataset.suggestion;
      sendMessage(suggestion);
      // Hide suggestions after first use
      suggestionsContainer.style.opacity = '0.3';
    }
  });

  // Navigation
  backBtn.addEventListener('click', () => navigate('analysis'));
  resultsBtn.addEventListener('click', () => navigate('results'));

  input.focus();
}
