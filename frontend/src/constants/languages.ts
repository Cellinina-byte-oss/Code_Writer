export const LANGUAGES = [
  { value: 'python', label: 'Python', extension: '.py' },
  { value: 'cpp', label: 'C++', extension: '.cpp' },
  { value: 'c', label: 'C', extension: '.c' },
  { value: 'java', label: 'Java', extension: '.java' },
] as const;

export type LanguageValue = typeof LANGUAGES[number]['value'];

export const DEFAULT_LANGUAGE: LanguageValue = 'python';

export const FONT_SIZE = {
  MIN: 10,
  MAX: 24,
  DEFAULT: 14,
  STEP: 1,
} as const;

export const PANEL_SIZE = {
  MIN_WIDTH: 250,
  MAX_WIDTH: 500,
  DEFAULT_WIDTH: 350,
} as const;
