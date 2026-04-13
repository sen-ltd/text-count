# text-count

Comprehensive text statistics tool. Paste text and get instant counts, reading time estimates, Japanese character classification, word frequency analysis, and social media character limit checks.

**Live demo**: https://sen.ltd/portfolio/text-count/

## Features

- **Basic counts** — characters, characters (no space), words, sentences, paragraphs, lines
- **Averages** — average word length, average sentence length, unique word count
- **Reading / speaking time** — at 200 wpm (easy), 400 wpm (fast), 150 wpm (speaking)
- **Japanese character classification** — hiragana, katakana, kanji, ASCII, digits, punctuation, other
- **Top 10 words** — frequency-ranked word list with bar chart
- **Top 15 characters** — CSS bar chart of most frequent characters
- **Social media limits** — Twitter/X (280), SMS (160), Facebook Post, Instagram Bio, Instagram Caption, LinkedIn Post
- **Dark / light theme**
- **Japanese / English UI**

## Stack

Vanilla JS (ES modules) · HTML · CSS · zero dependencies · no build step

## Run locally

```bash
npm run serve      # python3 -m http.server 8080
# open http://localhost:8080
```

## Tests

```bash
npm test
```

Uses Node.js built-in test runner (`node:test`). No dependencies required.

## License

MIT © 2026 SEN LLC (SEN 合同会社)
