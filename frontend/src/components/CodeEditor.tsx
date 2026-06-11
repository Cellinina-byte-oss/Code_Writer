import { useEffect, useRef, useCallback } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useThemeContext } from '../contexts/ThemeContext';
import { themes } from '../constants/theme';

export type Language = 'python' | 'cpp' | 'c' | 'java'

interface CodeEditorProps {
  code: string
  onChange: (value: string) => void
  language: Language
  fontSize?: number
  onAutoFix?: (fixedCode: string) => void
}

const languageMap: Record<Language, string> = {
  python: 'python',
  cpp: 'cpp',
  c: 'c',
  java: 'java'
}

function getMonacoTheme(themeId: string): editor.IStandaloneThemeData {
  const themeConfig = themes.find(t => t.id === themeId) || themes[0];

  const isDark = themeConfig.type === 'dark';

  return {
    base: isDark ? 'vs-dark' : 'vs',
    inherit: true,
    rules: isDark ? [
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'keyword', foreground: '569CD6' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'type', foreground: '4EC9B0' },
      { token: 'function', foreground: 'DCDCAA' },
      { token: 'variable', foreground: '9CDCFE' },
      { token: 'operator', foreground: 'D4D4D4' },
    ] : [
      { token: 'comment', foreground: '008000', fontStyle: 'italic' },
      { token: 'keyword', foreground: '0000FF' },
      { token: 'string', foreground: 'A31515' },
      { token: 'number', foreground: '098658' },
      { token: 'type', foreground: '267F99' },
      { token: 'function', foreground: '795E26' },
      { token: 'variable', foreground: '001080' },
      { token: 'operator', foreground: '000000' },
    ],
    colors: {
      'editor.background': themeConfig.backgroundSecondary,
      'editor.foreground': themeConfig.textPrimary,
      'editor.lineHighlightBackground': isDark ? '#2D2D2D' : '#F5F5F5',
      'editor.selectionBackground': isDark ? '#264F78' : '#ADD6FF',
      'editor.inactiveSelectionBackground': isDark ? '#3A3D41' : '#E5EBF1',
      'editorLineNumber.foreground': themeConfig.textMuted,
      'editorLineNumber.activeForeground': themeConfig.textSecondary,
      'editorCursor.foreground': themeConfig.accent,
      'editor.selectionHighlightBackground': isDark ? '#3A3D4166' : '#ADD6FF80',
      'editorIndentGuide.background': themeConfig.border,
      'editorIndentGuide.activeBackground': themeConfig.textMuted,
      'scrollbar.shadow': isDark ? '#000000' : '#898989',
      'scrollbarSlider.background': isDark ? '#79797966' : '#CCCCCC80',
      'scrollbarSlider.hoverBackground': isDark ? '#646464b3' : '# BBBBBB80',
      'scrollbarSlider.activeBackground': isDark ? '#BFbfbf66' : '#00000080',
    }
  };
}

export default function CodeEditor({ code, onChange, language, fontSize = 14, onAutoFix }: CodeEditorProps) {
  const { theme } = useThemeContext();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    const monacoTheme = getMonacoTheme(theme.id);
    monaco.editor.defineTheme('custom-theme', monacoTheme);
    monaco.editor.setTheme('custom-theme');

    if (code) {
      editor.setValue(code);
    }

    editor.addAction({
      id: 'auto-fix',
      label: '自动纠错',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF],
      contextMenuGroupId: '9_cutcopypaste',
      contextMenuOrder: 4,
      run: (ed) => {
        const currentCode = ed.getValue();
        const formatted = autoFixCode(currentCode, language);
        ed.setValue(formatted);
        if (onAutoFix) {
          onAutoFix(formatted);
        }
      }
    });

    editor.addAction({
      id: 'format-code',
      label: '格式化代码',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP],
      contextMenuGroupId: '9_cutcopypaste',
      contextMenuOrder: 3,
      run: (ed) => {
        ed.getAction('editor.action.formatDocument')?.run();
      }
    });

    editor.focus()
  };

  const autoFixCode = useCallback((code: string, lang: Language): string => {
    let fixed = code;

    if (lang === 'python') {
      const patterns: { pattern: RegExp; replacement: string }[] = [
        { pattern: /(\w+)\s*=\s*\[([\s\S]*?)\]\s*\n\s*for\s+\w+\s+in\s+range\(len\(\1\)\)/g, replacement: 'for i, $1 in enumerate($2])' },
        { pattern: /print\s*\(\s*['"]([^'"]*)['"]\s*%/, replacement: 'print(f\'$1\'' },
        { pattern: /def\s+(\w+)\s*\(\s*\):/g, replacement: 'def $1():' },
        { pattern: /class\s+(\w+)\s*\(\s*\):/g, replacement: 'class $1:' },
      ];

      for (const { pattern, replacement } of patterns) {
        fixed = fixed.replace(pattern, replacement);
      }

      const lines = fixed.split('\n');
      const cleaned: string[] = [];
      let prevEmpty = false;

      for (const line of lines) {
        const trimmed = line.replace(/\t/g, '    ');
        const isEmpty = trimmed.trim() === '';

        if (isEmpty) {
          if (!prevEmpty) {
            cleaned.push('');
          }
          prevEmpty = true;
        } else {
          cleaned.push(trimmed);
          prevEmpty = false;
        }
      }

      while (cleaned.length > 0 && cleaned[cleaned.length - 1] === '') {
        cleaned.pop();
      }

      fixed = cleaned.join('\n');

      fixed = fixed.replace(/:\s*##\s*/g, ':  # ');
      fixed = fixed.replace(/(\s+)##\s+/g, '$1# ');
      fixed = fixed.replace(/^\s*pass\s*$/gm, '');
      fixed = fixed.replace(/^\s*;\s*$/gm, '');

      fixed = fixed.replace(/print\s*\(\s*('[^']*'|\"[^\"]*\"|[^)]+)\s*\+\s*('[^']*'|\"[^\"]*\"|[^)]+)\s*\)/g, (_match, a, b) => {
        return `print(f'${a.replace(/['"]/g, '')}${b.replace(/['"]/g, '')}')`;
      });

      fixed = fixed.replace(/print\s*\(\s*'([^']*)'\s*\+\s*'([^']*)'\s*\)/g, 'print(f\'$1$2\')');
      fixed = fixed.replace(/print\s*\(\s*"([^"]*)"\s*\+\s*"([^"]*)"\s*\)/g, 'print(f"$1$2")');

      fixed = fixed.replace(/if\s+True:/g, 'if True:');
      fixed = fixed.replace(/if\s+False:/g, 'if False:');
      fixed = fixed.replace(/while\s+True:/g, 'while True:');

      fixed = fixed.replace(/#\s*$/gm, '');
    }

    if (lang === 'cpp' || lang === 'c') {
      fixed = fixed.replace(/#include\s*<\s*iostream\s*>/g, '#include <iostream>');
      fixed = fixed.replace(/#include\s*<\s*stdio\s*\.h\s*>/g, '#include <stdio.h>');
      fixed = fixed.replace(/#include\s*<\s*stdlib\s*\.h\s*>/g, '#include <stdlib.h>');
      fixed = fixed.replace(/#include\s*<\s*string\s*\.h\s*>/g, '#include <string.h>');

      fixed = fixed.replace(/cout\s*<<\s*"([^"]*)"\s*<<\s*endl/g, 'cout << "$1" << endl;');
      fixed = fixed.replace(/cout\s*<</g, 'cout <<');
      fixed = fixed.replace(/;\s*cout/g, '; cout');

      fixed = fixed.replace(/cin\s*>>/g, 'cin >>');
      fixed = fixed.replace(/>>\s*cin/g, '>> cin');

      const cppLines = fixed.split('\n');
      const cppCleaned: string[] = [];
      for (const line of cppLines) {
        let cleanedLine = line.replace(/\t/g, '    ');
        cleanedLine = cleanedLine.replace(/\s+$/, '');
        cppCleaned.push(cleanedLine);
      }
      fixed = cppCleaned.join('\n');
    }

    if (lang === 'java') {
      fixed = fixed.replace(/public\s+class\s+Main\s*\{/g, 'public class Main {');
      fixed = fixed.replace(/System\.out\.println\s*\(/g, 'System.out.println(');
      fixed = fixed.replace(/System\.out\.print\s*\(/g, 'System.out.print(');
      fixed = fixed.replace(/Scanner\s+scanner\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)/g, 'Scanner scanner = new Scanner(System.in);');

      const javaLines = fixed.split('\n');
      const javaCleaned: string[] = [];
      for (const line of javaLines) {
        let cleanedLine = line.replace(/\t/g, '    ');
        cleanedLine = cleanedLine.replace(/\s+$/, '');
        javaCleaned.push(cleanedLine);
      }
      fixed = javaCleaned.join('\n');
    }

    return fixed;
  }, []);

  const handleChange = (value: string | undefined) => {
    onChange(value || '')
  };

  useEffect(() => {
    if (monacoRef.current) {
      const monacoTheme = getMonacoTheme(theme.id);
      monacoRef.current.editor.defineTheme('custom-theme', monacoTheme);
      monacoRef.current.editor.setTheme('custom-theme');
    }
  }, [theme.id]);

  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== code) {
        editorRef.current.setValue(code);
      }
    }
  }, [code]);

  const getEditorOptions = (): editor.IStandaloneEditorConstructionOptions => ({
    minimap: { enabled: false },
    fontSize,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 4,
    insertSpaces: true,
    wordWrap: 'on',
    folding: true,
    foldingHighlight: true,
    bracketPairColorization: { enabled: true },
    renderLineHighlight: 'line',
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
    quickSuggestions: true,
    parameterHints: { enabled: true },
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    tabCompletion: 'on',
    wordBasedSuggestions: 'currentDocument',
    overviewRulerLanes: 2,
    mouseWheelZoom: true,
    formatOnPaste: true,
    formatOnType: true,
  })

  return (
    <div className="editor-container">
      <div className="editor-header">
        <span className="header-title">代码编辑区</span>
      </div>
      <div className="editor-wrapper">
        <Editor
          height="100%"
          language={languageMap[language]}
          theme="custom-theme"
          value={code}
          onChange={handleChange}
          onMount={handleEditorMount}
          options={getEditorOptions()}
        />
      </div>
    </div>
  )
}
