/**
 * stats.js — Pure counting and analysis functions for text-count.
 * No DOM dependencies; all functions are side-effect-free.
 */

/**
 * Total character count (including whitespace).
 * @param {string} text
 * @returns {number}
 */
export function countCharacters(text) {
  return [...text].length;
}

/**
 * Character count excluding all whitespace characters.
 * @param {string} text
 * @returns {number}
 */
export function countCharactersNoSpace(text) {
  return [...text].filter(c => !/\s/.test(c)).length;
}

/**
 * Word count — split on one or more whitespace characters.
 * Empty / whitespace-only string returns 0.
 * @param {string} text
 * @returns {number}
 */
export function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Sentence count — split on sentence-ending punctuation (.!?。！？).
 * Consecutive terminators are collapsed; leading/trailing don't produce empty sentences.
 * @param {string} text
 * @returns {number}
 */
export function countSentences(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  // Split on sentence terminators (one or more), filter empty strings
  const parts = trimmed.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
  return parts.length;
}

/**
 * Paragraph count — groups of non-empty lines separated by blank lines.
 * @param {string} text
 * @returns {number}
 */
export function countParagraphs(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\n\s*\n+/).filter(p => p.trim().length > 0).length;
}

/**
 * Line count — number of newline-separated lines.
 * An empty string has 0 lines; a non-empty string without newlines has 1 line.
 * @param {string} text
 * @returns {number}
 */
export function countLines(text) {
  if (!text) return 0;
  return text.split('\n').length;
}

/**
 * Classify a single Unicode character.
 * @param {string} c  A single character (code point).
 * @returns {'hiragana'|'katakana'|'kanji'|'ascii'|'digit'|'space'|'punctuation'|'other'}
 */
export function classifyChar(c) {
  const cp = c.codePointAt(0);
  if (cp === undefined) return 'other';

  // Whitespace
  if (/\s/.test(c)) return 'space';

  // ASCII printable (0x20-0x7E) — but digits and space already handled
  // ASCII range: 0x20–0x7E
  if (cp >= 0x20 && cp <= 0x7E) {
    if (cp >= 0x30 && cp <= 0x39) return 'digit'; // 0-9
    // Punctuation ASCII: 0x21-0x2F, 0x3A-0x40, 0x5B-0x60, 0x7B-0x7E
    if (
      (cp >= 0x21 && cp <= 0x2F) ||
      (cp >= 0x3A && cp <= 0x40) ||
      (cp >= 0x5B && cp <= 0x60) ||
      (cp >= 0x7B && cp <= 0x7E)
    ) return 'punctuation';
    return 'ascii';
  }

  // Hiragana: U+3041–U+309F
  if (cp >= 0x3041 && cp <= 0x309F) return 'hiragana';

  // Katakana: U+30A0–U+30FF
  if (cp >= 0x30A0 && cp <= 0x30FF) return 'katakana';

  // CJK Unified Ideographs (Kanji): U+4E00–U+9FFF
  if (cp >= 0x4E00 && cp <= 0x9FFF) return 'kanji';

  return 'other';
}

/**
 * Count characters by script / category.
 * @param {string} text
 * @returns {{ hiragana: number, katakana: number, kanji: number, ascii: number, digit: number, space: number, punctuation: number, other: number }}
 */
export function getCharStats(text) {
  const counts = { hiragana: 0, katakana: 0, kanji: 0, ascii: 0, digit: 0, space: 0, punctuation: 0, other: 0 };
  for (const c of text) {
    counts[classifyChar(c)]++;
  }
  return counts;
}

/**
 * Tokenise text into lowercase words (letters and digits only, min length 1).
 * Handles ASCII and CJK characters differently:
 * - ASCII/Latin: split on non-alphanumeric
 * - CJK: each character is its own "word"
 * @param {string} text
 * @returns {string[]}
 */
function tokenize(text) {
  const tokens = [];
  // Split on whitespace/punctuation clusters first
  const segments = text.split(/[\s\p{P}]+/u).filter(Boolean);
  for (const seg of segments) {
    // Check if segment is mostly CJK
    const cjkChars = [...seg].filter(c => {
      const cp = c.codePointAt(0);
      return (cp >= 0x3041 && cp <= 0x30FF) || (cp >= 0x4E00 && cp <= 0x9FFF);
    });
    if (cjkChars.length > 0) {
      // Treat each CJK character individually
      for (const c of seg) {
        const cp = c.codePointAt(0);
        if (
          (cp >= 0x3041 && cp <= 0x30FF) ||
          (cp >= 0x4E00 && cp <= 0x9FFF)
        ) {
          tokens.push(c);
        } else if (/\w/.test(c)) {
          tokens.push(c.toLowerCase());
        }
      }
    } else if (seg.length > 0) {
      tokens.push(seg.toLowerCase());
    }
  }
  return tokens.filter(t => t.length > 0);
}

/**
 * Top-N most frequent words/tokens.
 * @param {string} text
 * @param {number} [limit=10]
 * @returns {Array<[string, number]>}  Sorted descending by frequency.
 */
export function getWordFrequency(text, limit = 10) {
  const tokens = tokenize(text);
  if (tokens.length === 0) return [];
  const freq = new Map();
  for (const t of tokens) {
    freq.set(t, (freq.get(t) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}

/**
 * Reading time in seconds.
 * @param {number} wordCount
 * @param {number} [wpm=200]
 * @returns {number}
 */
export function readingTime(wordCount, wpm = 200) {
  if (wpm <= 0) return 0;
  return Math.round((wordCount / wpm) * 60);
}

/**
 * Speaking time in seconds.
 * @param {number} wordCount
 * @param {number} [wpm=150]
 * @returns {number}
 */
export function speakingTime(wordCount, wpm = 150) {
  if (wpm <= 0) return 0;
  return Math.round((wordCount / wpm) * 60);
}

/**
 * Check character count against common platform limits.
 * @param {string} text
 * @returns {{ twitter: LimitResult, sms: LimitResult, facebookPost: LimitResult, instagramBio: LimitResult, instagramCaption: LimitResult, linkedinPost: LimitResult }}
 *
 * @typedef {{ current: number, max: number, remaining: number, ok: boolean }} LimitResult
 */
export function getLimits(text) {
  const len = countCharacters(text);

  function make(max) {
    return { current: len, max, remaining: Math.max(0, max - len), ok: len <= max };
  }

  return {
    twitter: make(280),
    sms: make(160),
    facebookPost: make(63206),
    instagramBio: make(150),
    instagramCaption: make(2200),
    linkedinPost: make(3000),
  };
}

/**
 * Average word length (in characters).
 * @param {string} text
 * @returns {number}  Rounded to 1 decimal place. Returns 0 for empty input.
 */
export function averageWordLength(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const words = trimmed.split(/\s+/);
  const totalLen = words.reduce((sum, w) => sum + [...w].length, 0);
  return Math.round((totalLen / words.length) * 10) / 10;
}

/**
 * Average sentence length in words.
 * @param {string} text
 * @returns {number}  Rounded to 1 decimal place. Returns 0 for empty input.
 */
export function averageSentenceLength(text) {
  const sentences = countSentences(text);
  if (sentences === 0) return 0;
  const words = countWords(text);
  return Math.round((words / sentences) * 10) / 10;
}

/**
 * Unique word/token count (case-insensitive).
 * @param {string} text
 * @returns {number}
 */
export function uniqueWords(text) {
  const tokens = tokenize(text);
  return new Set(tokens).size;
}

/**
 * Character frequency for top-N characters (excluding whitespace).
 * @param {string} text
 * @param {number} [limit=15]
 * @returns {Array<[string, number]>}
 */
export function getCharFrequency(text, limit = 15) {
  const freq = new Map();
  for (const c of text) {
    if (/\s/.test(c)) continue;
    freq.set(c, (freq.get(c) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}

/**
 * Format seconds into a human-readable string (e.g. "1 min 30 sec" or "45 sec").
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  if (seconds <= 0) return '0 sec';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} sec`;
  if (s === 0) return `${m} min`;
  return `${m} min ${s} sec`;
}
