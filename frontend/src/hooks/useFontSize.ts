import { useState, useCallback } from 'react';
import { FONT_SIZE } from '../constants/languages';

interface UseFontSizeReturn {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

export function useFontSize(initialValue = FONT_SIZE.DEFAULT): UseFontSizeReturn {
  const [fontSize, setFontSize] = useState<number>(initialValue);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(prev + FONT_SIZE.STEP, FONT_SIZE.MAX));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(prev - FONT_SIZE.STEP, FONT_SIZE.MIN));
  }, []);

  const resetFontSize = useCallback(() => {
    setFontSize(FONT_SIZE.DEFAULT);
  }, []);

  return { fontSize, increaseFontSize, decreaseFontSize, resetFontSize };
}
