/* ============================================================
   ResumeAI Pro — Local Resume Analyzer
   Performs quick, local analysis without AI calls
   ============================================================ */

/**
 * Extract keywords from a job description
 * Returns an array of important keywords/phrases
 */
export function extractKeywords(jobDescription) {
  if (!jobDescription) return [];

  const text = jobDescription.toLowerCase();

  // Common filler words to ignore
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from',
    'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'and', 'but', 'or', 'nor', 'not', 'so', 'yet', 'both', 'either',
    'neither', 'each', 'every', 'all', 'any', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'only', 'own', 'same', 'than',
    'too', 'very', 'just', 'because', 'if', 'when', 'where', 'how',
    'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
    'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his',
    'she', 'her', 'it', 'its', 'they', 'them', 'their', 'am',
    'about', 'up', 'out', 'then', 'also', 'well', 'like', 'must',
    'looking', 'join', 'work', 'role', 'position', 'company', 'team',
    'including', 'etc', 'e.g', 'i.e', 'ability', 'able', 'strong',
    'experience', 'years', 'plus', 'required', 'preferred', 'nice',
    'have', 'knowledge', 'understanding', 'skills', 'working',
  ]);

  // Extract individual words (3+ chars, not stop words)
  const words = text.match(/\b[a-z][a-z-+#.]+\b/g) || [];
  const wordFreq = {};

  words.forEach(w => {
    if (w.length >= 3 && !stopWords.has(w)) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  });

  // Extract multi-word phrases (bigrams and trigrams)
  const phrases = [];
  const techPatterns = [
    /\b(?:react|angular|vue|next\.?js|node\.?js|express|django|flask|spring)\b/gi,
    /\b(?:typescript|javascript|python|java|c\+\+|c#|golang|rust|ruby|php|swift|kotlin)\b/gi,
    /\b(?:aws|azure|gcp|google cloud|docker|kubernetes|terraform|jenkins|ci\/cd)\b/gi,
    /\b(?:sql|nosql|mongodb|postgresql|mysql|redis|elasticsearch|dynamodb)\b/gi,
    /\b(?:rest|graphql|api|microservices|serverless|agile|scrum|kanban|devops)\b/gi,
    /\b(?:machine learning|deep learning|data science|artificial intelligence|ai|ml)\b/gi,
    /\b(?:testing|jest|cypress|selenium|unit test|integration test|tdd|bdd)\b/gi,
    /\b(?:design system|component library|accessibility|wcag|responsive design)\b/gi,
    /\b(?:state management|redux|zustand|mobx|context api)\b/gi,
    /\b(?:performance optimization|web performance|seo|core web vitals)\b/gi,
    /\b(?:code review|mentoring|leadership|cross-functional|collaboration)\b/gi,
    /\b(?:project management|product management|stakeholder|roadmap)\b/gi,
  ];

  techPatterns.forEach(pattern => {
    const matches = jobDescription.match(pattern) || [];
    matches.forEach(m => phrases.push(m.toLowerCase()));
  });

  // Combine words and phrases, sort by frequency/importance
  const allKeywords = new Map();

  // Add phrases first (higher priority)
  phrases.forEach(p => {
    allKeywords.set(p, (allKeywords.get(p) || 0) + 3);
  });

  // Add frequent words
  Object.entries(wordFreq)
    .filter(([, freq]) => freq >= 1)
    .forEach(([word, freq]) => {
      if (!allKeywords.has(word)) {
        allKeywords.set(word, freq);
      }
    });

  // Sort by score and return
  return Array.from(allKeywords.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([keyword]) => keyword)
    .slice(0, 40);
}


/**
 * Match resume keywords against job description keywords
 * Returns { matched: [], missing: [] }
 */
export function matchKeywords(resumeText, jobKeywords) {
  if (!resumeText || !jobKeywords.length) return { matched: [], missing: [] };

  const resumeLower = resumeText.toLowerCase();
  const matched = [];
  const missing = [];

  jobKeywords.forEach(keyword => {
    if (resumeLower.includes(keyword.toLowerCase())) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  return { matched, missing };
}


/**
 * Detect sections in a resume text
 */
export function detectSections(resumeText) {
  const sections = {
    hasName: false,
    hasContact: false,
    hasSummary: false,
    hasExperience: false,
    hasEducation: false,
    hasSkills: false,
    hasProjects: false,
    hasCertifications: false,
  };

  const lower = resumeText.toLowerCase();

  sections.hasContact = /email|phone|\b\d{3}[-.)]\s?\d{3}[-.)]\s?\d{4}\b|@|linkedin/i.test(resumeText);
  sections.hasSummary = /\b(summary|objective|profile|about)\b/i.test(resumeText);
  sections.hasExperience = /\b(experience|employment|work history|professional)\b/i.test(resumeText);
  sections.hasEducation = /\b(education|degree|university|college|academic)\b/i.test(resumeText);
  sections.hasSkills = /\b(skills|technical skills|competencies|technologies)\b/i.test(resumeText);
  sections.hasProjects = /\b(projects|portfolio)\b/i.test(resumeText);
  sections.hasCertifications = /\b(certifications?|certificates?|licenses?)\b/i.test(resumeText);

  // Check for name (first line is usually name)
  const firstLine = resumeText.trim().split('\n')[0]?.trim();
  sections.hasName = firstLine && firstLine.length < 60 && firstLine.length > 2;

  return sections;
}


/**
 * Quick local scoring (without AI)
 * Provides an instant preliminary score
 */
export function quickScore(resumeText, jobDescription) {
  if (!resumeText) return 0;

  let score = 30; // Base score for having content

  const sections = detectSections(resumeText);
  const keywords = extractKeywords(jobDescription);
  const { matched } = matchKeywords(resumeText, keywords);

  // Section completeness (up to 20 points)
  if (sections.hasSummary) score += 4;
  if (sections.hasExperience) score += 5;
  if (sections.hasEducation) score += 3;
  if (sections.hasSkills) score += 4;
  if (sections.hasContact) score += 2;
  if (sections.hasProjects) score += 2;

  // Keyword match (up to 30 points)
  if (keywords.length > 0) {
    const matchRate = matched.length / keywords.length;
    score += Math.round(matchRate * 30);
  }

  // Content quality heuristics (up to 20 points)
  const lines = resumeText.split('\n').filter(l => l.trim().length > 0);
  const bulletLines = lines.filter(l => /^\s*[-•*]\s/.test(l));

  // Has bullet points
  if (bulletLines.length > 3) score += 5;

  // Has quantified achievements
  const hasNumbers = (resumeText.match(/\d+[%$KMk+]/g) || []).length;
  score += Math.min(hasNumbers * 2, 8);

  // Good length (not too short, not too long)
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount >= 200 && wordCount <= 800) score += 4;
  else if (wordCount >= 100) score += 2;

  // Has action verbs
  const actionVerbs = /\b(led|managed|developed|built|designed|implemented|achieved|delivered|created|optimized|improved|increased|reduced|launched|mentored|spearheaded|engineered|orchestrated|drove|established)\b/gi;
  const verbCount = (resumeText.match(actionVerbs) || []).length;
  score += Math.min(verbCount, 3);

  return Math.min(Math.round(score), 100);
}


/**
 * Calculate individual category scores locally
 */
export function calculateLocalScores(resumeText, jobDescription) {
  const keywords = extractKeywords(jobDescription);
  const { matched, missing } = matchKeywords(resumeText, keywords);
  const sections = detectSections(resumeText);

  // Keyword score
  const keywordScore = keywords.length > 0
    ? Math.round((matched.length / keywords.length) * 100)
    : 50;

  // Impact score (quantification)
  const bulletLines = resumeText.split('\n').filter(l => /^\s*[-•*]\s/.test(l));
  const quantifiedBullets = bulletLines.filter(l => /\d+[%$KMk+]|\d{2,}/.test(l));
  const impactScore = bulletLines.length > 0
    ? Math.round((quantifiedBullets.length / bulletLines.length) * 100)
    : 20;

  // Clarity score
  const actionVerbs = /^[\s-•*]*\b(led|managed|developed|built|designed|implemented|achieved|delivered|created|optimized|improved|increased|reduced|launched|spearheaded|engineered)\b/gim;
  const actionBullets = bulletLines.filter(l => actionVerbs.test(l));
  actionVerbs.lastIndex = 0;
  const clarityScore = bulletLines.length > 0
    ? Math.min(Math.round((actionBullets.length / bulletLines.length) * 100) + 20, 100)
    : 30;

  // Relevance (based on keyword density)
  const relevanceScore = Math.min(keywordScore + 15, 100);

  return {
    keyword: keywordScore,
    impact: impactScore,
    clarity: clarityScore,
    relevance: relevanceScore,
    matched,
    missing,
    sections,
  };
}
