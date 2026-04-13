/**
 * i18n.js — Japanese / English translations for text-count.
 */

export const translations = {
  en: {
    title: 'Text Count',
    subtitle: 'Comprehensive text statistics',
    placeholder: 'Paste or type your text here…',
    clearBtn: 'Clear',
    copyBtn: 'Copy Stats',
    copiedBtn: 'Copied!',
    themeToggle: 'Toggle theme',
    langToggle: '日本語',

    // Stat card labels
    characters: 'Characters',
    charsNoSpace: 'Chars (no space)',
    words: 'Words',
    sentences: 'Sentences',
    paragraphs: 'Paragraphs',
    lines: 'Lines',
    uniqueWords: 'Unique words',
    avgWordLen: 'Avg. word length',
    avgSentLen: 'Avg. sentence length',
    avgSentLenUnit: 'words/sent.',

    // Reading / speaking time
    readingTimeTitle: 'Reading Time',
    speakingTimeTitle: 'Speaking Time',
    easyRead: 'Easy (200 wpm)',
    fastRead: 'Fast (400 wpm)',
    speaking: 'Speaking (150 wpm)',

    // Japanese char stats
    japaneseTitle: 'Japanese Characters',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    kanji: 'Kanji',
    ascii: 'ASCII',
    digit: 'Digits',
    punctuation: 'Punctuation',
    other: 'Other',

    // Word frequency
    wordFreqTitle: 'Top 10 Words',
    noWords: 'No words yet',

    // Char frequency chart
    charFreqTitle: 'Top 15 Characters',

    // Platform limits
    limitsTitle: 'Character Limits',
    twitter: 'Twitter / X',
    sms: 'SMS',
    facebookPost: 'Facebook Post',
    instagramBio: 'Instagram Bio',
    instagramCaption: 'Instagram Caption',
    linkedinPost: 'LinkedIn Post',
    remaining: 'remaining',
    over: 'over limit',
  },

  ja: {
    title: 'テキスト統計',
    subtitle: 'テキストの詳細統計',
    placeholder: 'テキストをここに貼り付けるか入力してください…',
    clearBtn: 'クリア',
    copyBtn: '統計をコピー',
    copiedBtn: 'コピー済み!',
    themeToggle: 'テーマ切替',
    langToggle: 'English',

    // Stat card labels
    characters: '文字数',
    charsNoSpace: '文字数（空白除く）',
    words: '単語数',
    sentences: '文数',
    paragraphs: '段落数',
    lines: '行数',
    uniqueWords: 'ユニーク単語数',
    avgWordLen: '平均単語長',
    avgSentLen: '平均文長',
    avgSentLenUnit: '語/文',

    // Reading / speaking time
    readingTimeTitle: '読書時間',
    speakingTimeTitle: 'スピーキング時間',
    easyRead: 'ゆっくり（200wpm）',
    fastRead: '速読（400wpm）',
    speaking: 'スピーキング（150wpm）',

    // Japanese char stats
    japaneseTitle: '日本語文字種',
    hiragana: 'ひらがな',
    katakana: 'カタカナ',
    kanji: '漢字',
    ascii: 'ASCII',
    digit: '数字',
    punctuation: '句読点',
    other: 'その他',

    // Word frequency
    wordFreqTitle: '頻出単語 TOP 10',
    noWords: 'まだ単語がありません',

    // Char frequency chart
    charFreqTitle: '頻出文字 TOP 15',

    // Platform limits
    limitsTitle: '文字数制限チェック',
    twitter: 'Twitter / X',
    sms: 'SMS',
    facebookPost: 'Facebook投稿',
    instagramBio: 'Instagramプロフィール',
    instagramCaption: 'Instagramキャプション',
    linkedinPost: 'LinkedInの投稿',
    remaining: '残り',
    over: 'オーバー',
  },
};

/**
 * @param {'en'|'ja'} lang
 * @returns {typeof translations.en}
 */
export function getT(lang) {
  return translations[lang] ?? translations.en;
}
