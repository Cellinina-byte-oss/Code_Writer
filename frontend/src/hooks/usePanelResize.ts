import { useState, useRef, useEffect, useCallback } from 'react';
import { PANEL_SIZE } from '../constants/languages';

interface UsePanelResizeOptions {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  side?: 'left' | 'right';
}

interface UsePanelResizeReturn {
  width: number;
  isResizing: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (e: React.MouseEvent) => void;
}

export function usePanelResize(options: UsePanelResizeOptions = {}): UsePanelResizeReturn {
  const {
    initialWidth = PANEL_SIZE.DEFAULT_WIDTH,
    minWidth = PANEL_SIZE.MIN_WIDTH,
    maxWidth = PANEL_SIZE.MAX_WIDTH,
    side = 'right'
  } = options;

  const [width, setWidth] = useState(initialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPositionRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!containerRef.current) return;
    
    setIsResizing(true);
    startPositionRef.current = e.clientX;
    startWidthRef.current = width;
  }, [width]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      
      const delta = e.clientX - startPositionRef.current;
      let newWidth: number;

      if (side === 'right') {
        newWidth = startWidthRef.current - delta;
      } else {
        newWidth = startWidthRef.current + delta;
      }

      setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = side === 'right' ? 'col-resize' : 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, minWidth, maxWidth, side]);

  return { width, isResizing, containerRef, handleMouseDown };
}
