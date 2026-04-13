/**
 * stats.test.js — Tests for stats.js using Node.js built-in test runner.
 * Run with: node --test tests/stats.test.js
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  countCharacters,
  countCharactersNoSpace,
  countWords,
  countSentences,
  countParagraphs,
  countLines,
  classifyChar,
  getCharStats,
  getWordFrequency,
  readingTime,
  speakingTime,
  getLimits,
  averageWordLength,
  averageSentenceLength,
  uniqueWords,
  getCharFrequency,
  formatTime,
} from '../src/stats.js';

// ─── countCharacters ─────────────────────────────────────────────────────────

test('countCharacters: empty string', () => {
  assert.equal(countCharacters(''), 0);
});

test('countCharacters: ASCII string', () => {
  assert.equal(countCharacters('hello'), 5);
});

test('countCharacters: string with spaces', () => {
  assert.equal(countCharacters('hello world'), 11);
});

test('countCharacters: multibyte emoji counts as 1', () => {
  // emoji with ZWJ — count code points, not UTF-16 units
  assert.equal(countCharacters('👋'), 1);
});

test('countCharacters: Japanese', () => {
  assert.equal(countCharacters('こんにちは'), 5);
});

// ─── countCharactersNoSpace ───────────────────────────────────────────────────

test('countCharactersNoSpace: empty string', () => {
  assert.equal(countCharactersNoSpace(''), 0);
});

test('countCharactersNoSpace: no spaces', () => {
  assert.equal(countCharactersNoSpace('hello'), 5);
});

test('countCharactersNoSpace: removes spaces and newlines', () => {
  assert.equal(countCharactersNoSpace('hello world\n'), 10);
});

// ─── countWords ──────────────────────────────────────────────────────────────

test('countWords: empty string', () => {
  assert.equal(countWords(''), 0);
});

test('countWords: whitespace only', () => {
  assert.equal(countWords('   '), 0);
});

test('countWords: single word', () => {
  assert.equal(countWords('hello'), 1);
});

test('countWords: multiple words', () => {
  assert.equal(countWords('the quick brown fox'), 4);
});

test('countWords: extra whitespace', () => {
  assert.equal(countWords('  hello   world  '), 2);
});

test('countWords: words with newlines', () => {
  assert.equal(countWords('line one\nline two'), 4);
});

// ─── countSentences ──────────────────────────────────────────────────────────

test('countSentences: empty string', () => {
  assert.equal(countSentences(''), 0);
});

test('countSentences: no terminator', () => {
  assert.equal(countSentences('hello world'), 1);
});

test('countSentences: two sentences', () => {
  assert.equal(countSentences('Hello. World.'), 2);
});

test('countSentences: Japanese terminators', () => {
  assert.equal(countSentences('こんにちは。今日は良い天気です。'), 2);
});

test('countSentences: mixed terminators', () => {
  assert.equal(countSentences('Really? Yes! Okay.'), 3);
});

test('countSentences: consecutive terminators treated as one', () => {
  assert.equal(countSentences('Wait... Really!?'), 2);
});

// ─── countParagraphs ─────────────────────────────────────────────────────────

test('countParagraphs: empty string', () => {
  assert.equal(countParagraphs(''), 0);
});

test('countParagraphs: single paragraph', () => {
  assert.equal(countParagraphs('hello world'), 1);
});

test('countParagraphs: two paragraphs', () => {
  assert.equal(countParagraphs('para one\n\npara two'), 2);
});

test('countParagraphs: multiple blank lines collapse', () => {
  assert.equal(countParagraphs('para one\n\n\npara two'), 2);
});

// ─── countLines ──────────────────────────────────────────────────────────────

test('countLines: empty string', () => {
  assert.equal(countLines(''), 0);
});

test('countLines: single line no newline', () => {
  assert.equal(countLines('hello'), 1);
});

test('countLines: two lines', () => {
  assert.equal(countLines('line1\nline2'), 2);
});

test('countLines: trailing newline', () => {
  assert.equal(countLines('line1\n'), 2);
});

// ─── classifyChar ────────────────────────────────────────────────────────────

test('classifyChar: hiragana', () => {
  assert.equal(classifyChar('あ'), 'hiragana');
  assert.equal(classifyChar('ん'), 'hiragana');
});

test('classifyChar: katakana', () => {
  assert.equal(classifyChar('ア'), 'katakana');
  assert.equal(classifyChar('ン'), 'katakana');
});

test('classifyChar: kanji', () => {
  assert.equal(classifyChar('日'), 'kanji');
  assert.equal(classifyChar('本'), 'kanji');
});

test('classifyChar: ASCII letter', () => {
  assert.equal(classifyChar('a'), 'ascii');
  assert.equal(classifyChar('Z'), 'ascii');
});

test('classifyChar: digit', () => {
  assert.equal(classifyChar('0'), 'digit');
  assert.equal(classifyChar('9'), 'digit');
});

test('classifyChar: space', () => {
  assert.equal(classifyChar(' '), 'space');
  assert.equal(classifyChar('\n'), 'space');
});

test('classifyChar: ASCII punctuation', () => {
  assert.equal(classifyChar('.'), 'punctuation');
  assert.equal(classifyChar('!'), 'punctuation');
  assert.equal(classifyChar('{'), 'punctuation');
});

test('classifyChar: other Unicode', () => {
  // Arabic character
  assert.equal(classifyChar('م'), 'other');
});

// ─── getCharStats ─────────────────────────────────────────────────────────────

test('getCharStats: mixed Japanese/ASCII', () => {
  const stats = getCharStats('abc あ ア 日');
  assert.equal(stats.ascii, 3);
  assert.equal(stats.hiragana, 1);
  assert.equal(stats.katakana, 1);
  assert.equal(stats.kanji, 1);
  assert.equal(stats.space, 3);
});

test('getCharStats: empty string all zeros', () => {
  const stats = getCharStats('');
  assert.equal(stats.hiragana, 0);
  assert.equal(stats.kanji, 0);
});

// ─── getWordFrequency ─────────────────────────────────────────────────────────

test('getWordFrequency: empty string', () => {
  assert.deepEqual(getWordFrequency(''), []);
});

test('getWordFrequency: top words sorted by frequency', () => {
  const freq = getWordFrequency('the cat sat on the mat the cat');
  assert.equal(freq[0][0], 'the');
  assert.equal(freq[0][1], 3);
  assert.equal(freq[1][0], 'cat');
  assert.equal(freq[1][1], 2);
});

test('getWordFrequency: respects limit', () => {
  const text = 'a b c d e f g h i j k l';
  const freq = getWordFrequency(text, 5);
  assert.equal(freq.length, 5);
});

test('getWordFrequency: case insensitive', () => {
  const freq = getWordFrequency('Hello hello HELLO');
  assert.equal(freq[0][1], 3);
});

// ─── readingTime ─────────────────────────────────────────────────────────────

test('readingTime: 200 words at 200 wpm = 60 sec', () => {
  assert.equal(readingTime(200, 200), 60);
});

test('readingTime: 0 words', () => {
  assert.equal(readingTime(0, 200), 0);
});

test('readingTime: default wpm is 200', () => {
  assert.equal(readingTime(100), 30);
});

test('readingTime: 400 wpm half the time', () => {
  assert.equal(readingTime(200, 400), 30);
});

// ─── speakingTime ────────────────────────────────────────────────────────────

test('speakingTime: 150 words at 150 wpm = 60 sec', () => {
  assert.equal(speakingTime(150, 150), 60);
});

test('speakingTime: 0 words', () => {
  assert.equal(speakingTime(0, 150), 0);
});

test('speakingTime: default wpm is 150', () => {
  assert.equal(speakingTime(150), 60);
});

// ─── getLimits ───────────────────────────────────────────────────────────────

test('getLimits: twitter 280 ok', () => {
  const l = getLimits('a'.repeat(280));
  assert.equal(l.twitter.ok, true);
  assert.equal(l.twitter.remaining, 0);
});

test('getLimits: twitter 281 over', () => {
  const l = getLimits('a'.repeat(281));
  assert.equal(l.twitter.ok, false);
});

test('getLimits: sms 160 boundary', () => {
  const l = getLimits('a'.repeat(160));
  assert.equal(l.sms.ok, true);
  assert.equal(l.sms.remaining, 0);
});

test('getLimits: empty text all ok', () => {
  const l = getLimits('');
  assert.equal(l.twitter.ok, true);
  assert.equal(l.sms.ok, true);
  assert.equal(l.instagramBio.ok, true);
});

test('getLimits: instagramBio max 150', () => {
  const l = getLimits('a'.repeat(151));
  assert.equal(l.instagramBio.ok, false);
  assert.equal(l.instagramBio.max, 150);
});

// ─── averageWordLength ────────────────────────────────────────────────────────

test('averageWordLength: empty string', () => {
  assert.equal(averageWordLength(''), 0);
});

test('averageWordLength: single word', () => {
  assert.equal(averageWordLength('hello'), 5);
});

test('averageWordLength: two words', () => {
  // 'hi' (2) + 'there' (5) = 7 / 2 = 3.5
  assert.equal(averageWordLength('hi there'), 3.5);
});

// ─── averageSentenceLength ────────────────────────────────────────────────────

test('averageSentenceLength: empty string', () => {
  assert.equal(averageSentenceLength(''), 0);
});

test('averageSentenceLength: one sentence one word', () => {
  assert.equal(averageSentenceLength('Hello.'), 1);
});

test('averageSentenceLength: two sentences', () => {
  // "Hello world" (2 words) + "Bye" (1 word) = 3 words / 2 sents = 1.5
  assert.equal(averageSentenceLength('Hello world. Bye.'), 1.5);
});

// ─── uniqueWords ─────────────────────────────────────────────────────────────

test('uniqueWords: empty string', () => {
  assert.equal(uniqueWords(''), 0);
});

test('uniqueWords: all different', () => {
  assert.equal(uniqueWords('cat dog bird'), 3);
});

test('uniqueWords: duplicates', () => {
  assert.equal(uniqueWords('the cat sat on the mat'), 5);
});

test('uniqueWords: case insensitive deduplication', () => {
  assert.equal(uniqueWords('Hello hello HELLO'), 1);
});

// ─── getCharFrequency ─────────────────────────────────────────────────────────

test('getCharFrequency: empty string', () => {
  assert.deepEqual(getCharFrequency(''), []);
});

test('getCharFrequency: top char is most frequent', () => {
  const freq = getCharFrequency('aaabbc');
  assert.equal(freq[0][0], 'a');
  assert.equal(freq[0][1], 3);
});

test('getCharFrequency: respects limit', () => {
  const freq = getCharFrequency('abcdefghijklmnopqrstuvwxyz', 5);
  assert.equal(freq.length, 5);
});

test('getCharFrequency: excludes whitespace', () => {
  const freq = getCharFrequency('a b c');
  const chars = freq.map(([c]) => c);
  assert.ok(!chars.includes(' '));
});

// ─── formatTime ──────────────────────────────────────────────────────────────

test('formatTime: 0 seconds', () => {
  assert.equal(formatTime(0), '0 sec');
});

test('formatTime: under a minute', () => {
  assert.equal(formatTime(45), '45 sec');
});

test('formatTime: exactly one minute', () => {
  assert.equal(formatTime(60), '1 min');
});

test('formatTime: minutes and seconds', () => {
  assert.equal(formatTime(90), '1 min 30 sec');
});

test('formatTime: negative treated as 0', () => {
  assert.equal(formatTime(-5), '0 sec');
});
