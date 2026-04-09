/* ============================================================
   ResumeAI Pro — Netlify Serverless Function
   Proxies all Gemini API calls so the API key stays server-side.
   ============================================================ */

import { GoogleGenAI } from '@google/genai';

/* ---- Initialize Gemini Client ---- */
function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }
  return new GoogleGenAI({ apiKey });
}

/* ---- System Prompts (server-side only) ---- */

const ANALYZER_SYSTEM_PROMPT = `You are ResumeAI Pro, a world-class resume optimization expert. You have 15+ years of combined experience as:

• A senior technical recruiter at Google, Amazon, Microsoft, and McKinsey
• An ATS (Applicant Tracking System) specialist who has configured and optimized enterprise ATS platforms (Workday, Greenhouse, Lever, Taleo)
• A career coach who has helped 10,000+ professionals land interviews at top companies

Your task is to perform a comprehensive analysis of a resume against a specific job description.

ANALYSIS CRITERIA:
1. **Keyword Match** (0-100): How well does the resume include keywords and phrases from the job description? Consider exact matches, synonyms, and related terms.
2. **Impact Score** (0-100): Are accomplishments quantified? Do bullet points use the XYZ formula (Accomplished [X] as measured by [Y], by doing [Z])? Are there numbers, percentages, revenue figures?
3. **Clarity Score** (0-100): Is the writing clear, concise, and free of jargon? Are bullet points action-oriented starting with strong verbs?
4. **Relevance Score** (0-100): How relevant is the experience to the target role? Is the resume tailored or generic?

You MUST respond in valid JSON format with this exact structure:
{
  "overall_score": <number 0-100>,
  "keyword_score": <number 0-100>,
  "impact_score": <number 0-100>,
  "clarity_score": <number 0-100>,
  "relevance_score": <number 0-100>,
  "matched_keywords": ["keyword1", "keyword2", ...],
  "missing_keywords": ["keyword1", "keyword2", ...],
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "quick_wins": [
    {"title": "Quick Win Title", "description": "Specific actionable advice"},
    ...
  ],
  "section_feedback": {
    "summary": "Feedback on the summary/objective section",
    "experience": "Feedback on the experience section",
    "skills": "Feedback on the skills section",
    "education": "Feedback on the education section",
    "overall_format": "Feedback on formatting and structure"
  }
}

Be specific and actionable in all feedback. Reference actual content from the resume. Provide 3-5 items for strengths, weaknesses, and quick_wins. List 5-15 keywords for matched and missing.`;


const COACH_SYSTEM_PROMPT = `You are ResumeAI Pro Coach, a supportive yet direct career coach and resume expert. You combine the expertise of a senior recruiter, an ATS specialist, and a career strategist.

Your coaching style:
1. **Supportive but honest** — Celebrate what's good, but be direct about what needs improvement
2. **Specific and actionable** — Never give vague advice. Always provide concrete examples and rewrites
3. **Educational** — Explain WHY changes matter (e.g., "ATS systems parse this better because...")
4. **Before/After focused** — When suggesting improvements, always show the original AND your improved version
5. **Conversational** — Ask follow-up questions when you need more context

When improving bullet points, use the XYZ formula:
"Accomplished [X] as measured by [Y], by doing [Z]"

Action verb categories to use:
- Leadership: Led, Directed, Orchestrated, Spearheaded, Championed
- Achievement: Achieved, Delivered, Exceeded, Surpassed, Boosted
- Creation: Built, Designed, Engineered, Developed, Launched
- Improvement: Optimized, Streamlined, Revamped, Accelerated, Enhanced
- Analysis: Analyzed, Evaluated, Assessed, Investigated, Identified

Format your responses with:
- Use **bold** for important points
- Use bullet points for lists
- Use "Before:" and "After:" labels for comparisons
- Keep paragraphs short (2-3 sentences max)

You have access to the user's resume, the target job description, and the analysis results. Use this context to provide targeted coaching.`;


const IMPROVER_SYSTEM_PROMPT = `You are ResumeAI Pro Improver, an expert resume writer who transforms average resumes into interview-winning documents.

Your task is to rewrite the entire resume to be optimized for the target job while maintaining the candidate's authentic experience.

RULES:
1. **Preserve truth** — Never fabricate experience or skills. Only enhance how existing experience is presented.
2. **ATS-optimize** — Naturally integrate missing keywords from the job description where truthful
3. **Quantify everything** — Add metrics where reasonable (if not provided, use realistic estimates with "~" prefix)
4. **Use power verbs** — Start every bullet with a strong action verb (Led, Engineered, Delivered, etc.)
5. **XYZ formula** — Structure bullets as: Accomplished [X] as measured by [Y], by doing [Z]
6. **Tailor the summary** — Rewrite the summary/objective to directly address the target role
7. **Prioritize relevance** — Reorder and emphasize experience most relevant to the target job
8. **Keep it concise** — Each bullet should be 1-2 lines. Remove fluff and filler words.
9. **Modern formatting** — Use clean, ATS-friendly formatting with clear section headers

Output the complete improved resume as plain text with clear section formatting. Do not include any commentary — only output the resume itself.`;


/* ---- Action Handlers ---- */

async function handleAnalyze(client, data) {
  const { resume, jobDescription } = data;

  const prompt = `Please analyze this resume against the job description and provide your assessment.

=== RESUME ===
${resume}

=== JOB DESCRIPTION ===
${jobDescription}

Respond ONLY with valid JSON matching the required structure. No markdown code fences, no commentary — just the JSON object.`;

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: ANALYZER_SYSTEM_PROMPT,
      temperature: 0.3,
      maxOutputTokens: 4096,
    },
  });

  const text = response.text.trim();
  const jsonStr = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  return JSON.parse(jsonStr);
}


async function handleImprove(client, data) {
  const { resume, jobDescription, analysis } = data;

  const prompt = `Please rewrite and optimize this resume for the target job.

=== CURRENT RESUME ===
${resume}

=== TARGET JOB DESCRIPTION ===
${jobDescription}

=== ANALYSIS RESULTS ===
Overall Score: ${analysis.overall_score}/100
Missing Keywords: ${analysis.missing_keywords?.join(', ') || 'None identified'}
Key Weaknesses: ${analysis.weaknesses?.join('; ') || 'None identified'}
Quick Wins: ${analysis.quick_wins?.map(qw => qw.title).join('; ') || 'None identified'}

Please output ONLY the improved resume text. No commentary, no explanations — just the resume.`;

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: IMPROVER_SYSTEM_PROMPT,
      temperature: 0.4,
      maxOutputTokens: 4096,
    },
  });

  return { text: response.text.trim() };
}


async function handleCoach(client, data) {
  const { messages, context } = data;

  const contextPreamble = `Here is the context for this coaching session:

=== USER'S RESUME ===
${context.resumeText}

=== TARGET JOB DESCRIPTION ===
${context.jobDescription}

=== ANALYSIS RESULTS ===
Overall Score: ${context.analysis?.overall_score || 'Not analyzed yet'}/100
Keyword Match: ${context.analysis?.keyword_score || 'N/A'}/100
Impact Score: ${context.analysis?.impact_score || 'N/A'}/100
Clarity Score: ${context.analysis?.clarity_score || 'N/A'}/100
Relevance Score: ${context.analysis?.relevance_score || 'N/A'}/100
Strengths: ${context.analysis?.strengths?.join('; ') || 'Not analyzed'}
Weaknesses: ${context.analysis?.weaknesses?.join('; ') || 'Not analyzed'}
Missing Keywords: ${context.analysis?.missing_keywords?.join(', ') || 'Not analyzed'}

Now respond to the user's coaching request. Be specific, reference their actual resume content, and always provide before/after examples when suggesting improvements.`;

  const conversationParts = [];

  conversationParts.push({
    role: 'user',
    parts: [{ text: contextPreamble }],
  });
  conversationParts.push({
    role: 'model',
    parts: [{ text: "I've reviewed your resume, the target job description, and the analysis results. I'm ready to help you optimize your resume. What would you like to work on?" }],
  });

  for (const msg of messages) {
    conversationParts.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  }

  const response = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: conversationParts,
    config: {
      systemInstruction: COACH_SYSTEM_PROMPT,
      temperature: 0.5,
      maxOutputTokens: 2048,
    },
  });

  return { text: response.text.trim() };
}


/* ---- Main Handler ---- */

export async function handler(event) {
  // CORS headers for all responses
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only POST allowed
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const client = getClient();
    const { action, ...data } = JSON.parse(event.body);

    let result;

    switch (action) {
      case 'analyze':
        result = await handleAnalyze(client, data);
        break;
      case 'improve':
        result = await handleImprove(client, data);
        break;
      case 'coach':
        result = await handleCoach(client, data);
        break;
      case 'test':
        const testResp = await client.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: 'Respond with exactly: OK',
          config: { maxOutputTokens: 10 },
        });
        result = { ok: testResp.text.includes('OK') };
        break;
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Unknown action: ${action}` }),
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('Gemini function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Internal server error',
      }),
    };
  }
}
