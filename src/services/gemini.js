/* ============================================================
   ResumeAI Pro — Gemini AI Service (Frontend Client)
   Calls the Netlify serverless function instead of Gemini directly.
   API key never touches the browser.
   ============================================================ */

const FUNCTION_URL = '/.netlify/functions/gemini';

/**
 * Call the serverless Gemini function
 */
async function callFunction(action, data) {
  const response = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...data }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `Server error (${response.status})`);
  }

  return response.json();
}


/**
 * Analyze a resume against a job description
 * Returns structured JSON with scores, keywords, and feedback
 */
export async function analyzeResume(resumeText, jobDescription) {
  try {
    return await callFunction('analyze', {
      resume: resumeText,
      jobDescription,
    });
  } catch (error) {
    console.error('Analysis failed:', error);
    throw new Error(`Analysis failed: ${error.message}`);
  }
}


/**
 * Generate an improved version of the resume
 * Returns the complete improved resume as plain text
 */
export async function improveResume(resumeText, jobDescription, analysis) {
  try {
    const result = await callFunction('improve', {
      resume: resumeText,
      jobDescription,
      analysis,
    });
    return result.text;
  } catch (error) {
    console.error('Resume improvement failed:', error);
    throw new Error(`Improvement failed: ${error.message}`);
  }
}


/**
 * Chat with the AI coach
 * Takes conversation history and context, returns coach response
 */
export async function coachChat(messages, context) {
  try {
    const result = await callFunction('coach', { messages, context });
    return result.text;
  } catch (error) {
    console.error('Coach chat failed:', error);
    throw new Error(`Coach chat failed: ${error.message}`);
  }
}


/**
 * Test the API connection
 */
export async function testConnection() {
  try {
    const result = await callFunction('test', {});
    return result.ok === true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}
