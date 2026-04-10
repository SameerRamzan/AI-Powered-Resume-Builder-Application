/* ============================================================
   ResumeAI Pro — File Parser Service
   Client-side extraction of text from PDF, DOCX, and TXT files
   ============================================================ */

import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker using Vite's URL import
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

/** Supported file extensions */
export const SUPPORTED_EXTENSIONS = ['pdf', 'docx', 'txt', 'rtf'];
export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/rtf',
  'application/rtf',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Parse a resume file and extract text content
 * @param {File} file - The uploaded file
 * @returns {Promise<{text: string, fileName: string, pageCount?: number}>}
 */
export async function parseResumeFile(file) {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File is too large. Maximum size is 10 MB.');
  }

  if (file.size === 0) {
    throw new Error('File is empty.');
  }

  const extension = file.name.split('.').pop().toLowerCase();

  switch (extension) {
    case 'pdf':
      return await parsePDF(file);
    case 'docx':
      return await parseDOCX(file);
    case 'txt':
    case 'rtf':
      return await parseText(file);
    default:
      throw new Error(
        `Unsupported file format: .${extension}. Supported formats: ${SUPPORTED_EXTENSIONS.join(', ')}`
      );
  }
}

/**
 * Extract text from a PDF file
 */
async function parsePDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    // Build text with spatial awareness
    let lastY = null;
    let lineText = '';

    for (const item of content.items) {
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
        // New line detected (Y position changed)
        fullText += lineText.trimEnd() + '\n';
        lineText = '';
      }
      lineText += item.str;
      lastY = item.transform[5];
    }

    // Flush last line of page
    if (lineText.trim()) {
      fullText += lineText.trimEnd() + '\n';
    }

    // Page separator
    if (i < totalPages) {
      fullText += '\n';
    }
  }

  const text = cleanExtractedText(fullText);

  if (!text) {
    throw new Error(
      'No readable text found in this PDF. It may be a scanned/image-based document. Please copy-paste your resume text instead.'
    );
  }

  return { text, fileName: file.name, pageCount: totalPages };
}

/**
 * Extract text from a DOCX file
 */
async function parseDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });

  const text = cleanExtractedText(result.value);

  if (!text) {
    throw new Error('No text could be extracted from this document.');
  }

  return { text, fileName: file.name };
}

/**
 * Read plain text / RTF files
 */
async function parseText(file) {
  let rawText = await file.text();

  // Basic RTF stripping (remove RTF control words)
  if (file.name.toLowerCase().endsWith('.rtf')) {
    rawText = stripRTF(rawText);
  }

  const text = cleanExtractedText(rawText);

  if (!text) {
    throw new Error('File appears to be empty or contains no readable text.');
  }

  return { text, fileName: file.name };
}

/**
 * Strip RTF formatting to extract plain text
 */
function stripRTF(rtf) {
  // Remove RTF header and control groups
  let text = rtf
    .replace(/\\par\b/g, '\n')             // Paragraph breaks
    .replace(/\\line\b/g, '\n')            // Line breaks
    .replace(/\\tab\b/g, '\t')             // Tabs
    .replace(/\{\\[^{}]*\}/g, '')          // Remove nested groups
    .replace(/\\[a-z]+\d*\s?/gi, '')       // Remove control words
    .replace(/[{}]/g, '')                  // Remove remaining braces
    .replace(/\\'([0-9a-f]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  return text;
}

/**
 * Clean up extracted text — normalize whitespace, remove artifacts
 */
function cleanExtractedText(text) {
  return text
    .replace(/\r\n/g, '\n')                 // Normalize line endings
    .replace(/\r/g, '\n')
    .replace(/\t/g, '  ')                   // Tabs to spaces
    .replace(/ {3,}/g, '  ')               // Collapse excessive spaces
    .replace(/\n{4,}/g, '\n\n\n')          // Max 3 consecutive newlines
    .replace(/^\s+/, '')                    // Trim leading whitespace
    .replace(/\s+$/, '')                    // Trim trailing whitespace
    .trim();
}

/**
 * Get a human-readable file size string
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
