/**
 * main.js — DOM wiring, events, rendering for text-count.
 */

import {
  countCharacters,
  countCharactersNoSpace,
  countWords,
  countSentences,
  countParagraphs,
  countLines,
  getCharStats,
  getWordFrequency,
  getCharFrequency,
  readingTime,
  speakingTime,
  getLimits,
  averageWordLength,
  averageSentenceLength,
  uniqueWords,
  formatTime,
} from './stats.js';
import { getT } from './i18n.js';

// ─── State ──────────────────────────────────────────────────────────────────

let lang = 'en';
let theme = 'dark';

// ─── DOM References ──────────────────────────────────────────────────────────

const textarea     = document.getElementById('input');
const clearBtn     = document.getElementById('clearBtn');
const copyBtn      = document.getElementById('copyBtn');
const langToggle   = document.getElementById('langToggle');
const themeToggle  = document.getElementById('themeToggle');

// ─── Utilities ───────────────────────────────────────────────────────────────

function $(id) { return document.getElementById(id); }

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function setAttr(id, attr, value) {
  const el = $(id);
  if (el) el.setAttribute(attr, value);
}

// ─── Render ──────────────────────────────────────────────────────────────────

function render() {
  const text = textarea.value;
  const t = getT(lang);

  // Basic counts
  const chars    = countCharacters(text);
  const noSpace  = countCharactersNoSpace(text);
  const words    = countWords(text);
  const sents    = countSentences(text);
  const paras    = countParagraphs(text);
  const lines    = countLines(text);
  const uniq     = uniqueWords(text);
  const avgWL    = averageWordLength(text);
  const avgSL    = averageSentenceLength(text);

  setText('stat-chars',    chars);
  setText('stat-noSpace',  noSpace);
  setText('stat-words',    words);
  setText('stat-sents',    sents);
  setText('stat-paras',    paras);
  setText('stat-lines',    lines);
  setText('stat-unique',   uniq);
  setText('stat-avgWL',    avgWL.toFixed(1));
  setText('stat-avgSL',    `${avgSL.toFixed(1)} ${t.avgSentLenUnit}`);

  // Reading / speaking time
  const rtEasy  = readingTime(words, 200);
  const rtFast  = readingTime(words, 400);
  const st      = speakingTime(words, 150);
  setText('stat-rtEasy', formatTime(rtEasy));
  setText('stat-rtFast', formatTime(rtFast));
  setText('stat-st',     formatTime(st));

  // Japanese char stats
  const cs = getCharStats(text);
  setText('stat-hiragana',    cs.hiragana);
  setText('stat-katakana',    cs.katakana);
  setText('stat-kanji',       cs.kanji);
  setText('stat-ascii',       cs.ascii);
  setText('stat-digit',       cs.digit);
  setText('stat-punctuation', cs.punctuation);
  setText('stat-other',       cs.other);

  // Word frequency
  renderWordFrequency(text, t);

  // Character frequency chart
  renderCharFrequency(text);

  // Platform limits
  renderLimits(text, t);
}

function renderWordFrequency(text, t) {
  const container = $('wordFreqList');
  if (!container) return;
  const freq = getWordFrequency(text, 10);
  if (freq.length === 0) {
    container.innerHTML = `<li class="no-data">${t.noWords}</li>`;
    return;
  }
  const max = freq[0][1];
  container.innerHTML = freq.map(([word, count]) => {
    const pct = max > 0 ? Math.round((count / max) * 100) : 0;
    return `<li>
      <span class="wf-word" title="${escHtml(word)}">${escHtml(word)}</span>
      <span class="wf-bar-wrap">
        <span class="wf-bar" style="width:${pct}%"></span>
      </span>
      <span class="wf-count">${count}</span>
    </li>`;
  }).join('');
}

function renderCharFrequency(text) {
  const container = $('charFreqChart');
  if (!container) return;
  const freq = getCharFrequency(text, 15);
  if (freq.length === 0) {
    container.innerHTML = '';
    return;
  }
  const max = freq[0][1];
  container.innerHTML = freq.map(([char, count]) => {
    const pct = max > 0 ? Math.round((count / max) * 100) : 0;
    return `<div class="cf-col">
      <div class="cf-bar-wrap" title="${count}">
        <div class="cf-bar" style="height:${pct}%"></div>
      </div>
      <div class="cf-label">${escHtml(char)}</div>
    </div>`;
  }).join('');
}

function renderLimits(text, t) {
  const limits = getLimits(text);
  const keys = [
    ['twitter',          t.twitter],
    ['sms',              t.sms],
    ['facebookPost',     t.facebookPost],
    ['instagramBio',     t.instagramBio],
    ['instagramCaption', t.instagramCaption],
    ['linkedinPost',     t.linkedinPost],
  ];
  for (const [key, label] of keys) {
    const el = $(`limit-${key}`);
    if (!el) continue;
    const { current, max, remaining, ok } = limits[key];
    const pct = Math.min(100, Math.round((current / max) * 100));
    const statusText = ok
      ? `${remaining} ${t.remaining}`
      : `${current - max} ${t.over}`;
    el.innerHTML = `
      <div class="limit-header">
        <span class="limit-name">${label}</span>
        <span class="limit-status ${ok ? 'ok' : 'over'}">${statusText}</span>
      </div>
      <div class="limit-bar-wrap">
        <div class="limit-bar ${ok ? '' : 'over'}" style="width:${pct}%"></div>
      </div>
      <div class="limit-nums">${current} / ${max}</div>
    `;
  }
}

// ─── i18n rendering ──────────────────────────────────────────────────────────

function applyTranslations() {
  const t = getT(lang);
  // Labels via data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });
  textarea.placeholder = t.placeholder;
  langToggle.textContent = t.langToggle;
}

// ─── Theme ───────────────────────────────────────────────────────────────────

function applyTheme() {
  document.documentElement.dataset.theme = theme;
}

// ─── Event handlers ──────────────────────────────────────────────────────────

textarea.addEventListener('input', render);

clearBtn.addEventListener('click', () => {
  textarea.value = '';
  render();
  textarea.focus();
});

copyBtn.addEventListener('click', () => {
  const text = textarea.value;
  const t = getT(lang);
  const words    = countWords(text);
  const chars    = countCharacters(text);
  const noSpace  = countCharactersNoSpace(text);
  const sents    = countSentences(text);
  const paras    = countParagraphs(text);
  const lines    = countLines(text);
  const cs       = getCharStats(text);

  const summary = [
    `${t.characters}: ${chars}`,
    `${t.charsNoSpace}: ${noSpace}`,
    `${t.words}: ${words}`,
    `${t.sentences}: ${sents}`,
    `${t.paragraphs}: ${paras}`,
    `${t.lines}: ${lines}`,
    `${t.hiragana}: ${cs.hiragana}`,
    `${t.katakana}: ${cs.katakana}`,
    `${t.kanji}: ${cs.kanji}`,
  ].join('\n');

  navigator.clipboard.writeText(summary).then(() => {
    copyBtn.textContent = t.copiedBtn;
    setTimeout(() => { copyBtn.textContent = t.copyBtn; }, 2000);
  }).catch(() => {});
});

langToggle.addEventListener('click', () => {
  lang = lang === 'en' ? 'ja' : 'en';
  applyTranslations();
  render();
});

themeToggle.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme();
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Init ─────────────────────────────────────────────────────────────────────

applyTheme();
applyTranslations();
render();
