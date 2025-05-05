"use client";
import React, { useRef, useEffect, useState } from 'react';
import { X, Share, Copy, Save, Play, Settings, ChevronDown, RefreshCw } from 'lucide-react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface CodeEditorComponentProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  language?: string;
  title?: string;
  instructions?: string;
  sectionId: string;
  lectureId: string;
  onSaveCode?: (sectionId: string, lectureId: string, code: string, language: string) => void;
}

const supportedLanguages = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'csharp', name: 'C#' },
  { id: 'cpp', name: 'C++' },
  { id: 'php', name: 'PHP' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'sql', name: 'SQL' },
];

// Default starter code templates for different languages
const getDefaultCodeTemplate = (language: string): string => {
  switch (language) {
    case 'javascript':
      return '// JavaScript Code\nconsole.log("Hello, World!");\n\n// Write your code here\nfunction solution() {\n  // Your solution goes here\n  \n  return result;\n}\n';
    case 'typescript':
      return '// TypeScript Code\nconsole.log("Hello, World!");\n\n// Write your code here\nfunction solution(): any {\n  // Your solution goes here\n  \n  return result;\n}\n';
    case 'python':
      return '# Python Code\nprint("Hello, World!")\n\n# Write your code here\ndef solution():\n    # Your solution goes here\n    \n    return result\n';
    case 'java':
      return '// Java Code\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n    \n    public static Object solution() {\n        // Your solution goes here\n        \n        return result;\n    }\n}';
    case 'html':
      return '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n    \n    <!-- Your code here -->\n    \n</body>\n</html>';
    case 'css':
      return '/* CSS Styles */\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n}\n\n/* Your styles here */\n';
    default:
      return `// ${language} Code\n// Write your code here\n`;
  }
};

const CodeEditorComponent: React.FC<CodeEditorComponentProps> = ({
  isOpen,
  onClose,
  initialCode,
  language = 'javascript',
  title = 'Code Practice',
  instructions = 'Write your code here to solve the problem.',
  sectionId,
  lectureId,
  onSaveCode,
}) => {
  const [code, setCode] = useState<string>(initialCode || getDefaultCodeTemplate(language));
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'vs-dark' | 'vs-light'>('vs-dark');
  const [fontSize, setFontSize] = useState<number>(14);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Handle editor mounting
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Set up editor options
    editor.updateOptions({
      fontSize: fontSize,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      lineNumbers: 'on',
      tabSize: 2,
      formatOnPaste: true,
      formatOnType: true,
    });
  };

  // Change language handler
  const handleLanguageChange = (langId: string) => {
    setSelectedLanguage(langId);
    if (!initialCode) {
      setCode(getDefaultCodeTemplate(langId));
    }
    setIsLanguageDropdownOpen(false);
  };

  // Run code handler (simulated - would need backend integration for actual execution)
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('');
    
    // Simulated code execution delay
    setTimeout(() => {
      try {
        // This is just a simple simulation. For real execution, you'd need a backend service.
        let executionOutput = '';
        
        if (selectedLanguage === 'javascript' || selectedLanguage === 'typescript') {
          // Very simple and limited simulation - only for demonstration
          // IMPORTANT: This is not secure and only captures console.log output
          const originalConsoleLog = console.log;
          const logs: string[] = [];
          
          console.log = (...args) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '));
          };
          
          try {
            // This is extremely unsafe and only for demonstration
            // In a real app, you would NEVER use eval like this
            // Instead you would use a secure backend sandbox
            eval(`(function() { ${code} })()`);
            executionOutput = logs.join('\n');
          } catch (error) {
            executionOutput = `Error: ${error instanceof Error ? error.message : String(error)}`;
          }
          
          console.log = originalConsoleLog;
        } else {
          executionOutput = "Code execution requires a backend service.\nThis is a frontend simulation only.\n\nTo run code in other languages, you would need to integrate with a backend code execution service.";
        }
        
        setOutput(executionOutput);
      } catch (error) {
        setOutput(`Execution error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };

  // Save code handler
  const handleSaveCode = () => {
    if (onSaveCode) {
      onSaveCode(sectionId, lectureId, code, selectedLanguage);
    }
  };

  // Copy code handler
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    // Optional: Show a toast notification
  };

  // Reset code handler
  const handleResetCode = () => {
    setCode(getDefaultCodeTemplate(selectedLanguage));
  };

  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === 'vs-dark' ? 'vs-light' : 'vs-dark');
  };

  // Handle font size change
  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: size });
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
      <div className="relative w-full h-full sm:w-11/12 sm:h-5/6 md:w-10/12 md:h-5/6 lg:w-5/6 lg:h-5/6 xl:w-4/5 xl:h-5/6 bg-gray-900 rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b ${theme === 'vs-dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'}`}>
          <div className="flex items-center">
            <h2 className={`text-lg font-semibold ${theme === 'vs-dark' ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
          </div>
          <div className="flex items-center space-x-3">
            {/* Language selector */}
            <div className="relative">
              <button 
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className={`flex items-center px-3 py-1 text-sm rounded ${theme === 'vs-dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              >
                {supportedLanguages.find(lang => lang.id === selectedLanguage)?.name || selectedLanguage}
                <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              
              {isLanguageDropdownOpen && (
                <div 
                  className={`absolute right-0 z-10 mt-1 w-48 rounded-md shadow-lg ${theme === 'vs-dark' ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto`}
                >
                  <div className="py-1">
                    {supportedLanguages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => handleLanguageChange(lang.id)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          selectedLanguage === lang.id 
                            ? (theme === 'vs-dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900') 
                            : (theme === 'vs-dark' ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100')
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings button */}
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-2 rounded-full ${theme === 'vs-dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
            
            {/* Settings dropdown */}
            {isSettingsOpen && (
              <div 
                className={`absolute right-16 top-14 z-10 mt-1 w-48 rounded-md shadow-lg ${theme === 'vs-dark' ? 'bg-gray-800' : 'bg-white'} ring-1 ring-black ring-opacity-5`}
              >
                <div className="py-2 px-3">
                  <div className="mb-3">
                    <label className={`block text-sm font-medium ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Theme
                    </label>
                    <button 
                      onClick={toggleTheme}
                      className={`mt-1 block w-full px-3 py-2 text-sm rounded ${
                        theme === 'vs-dark' 
                          ? 'bg-gray-700 text-white hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {theme === 'vs-dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'vs-dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Font Size
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <button 
                        onClick={() => handleFontSizeChange(Math.max(8, fontSize - 2))}
                        className={`px-2 py-1 text-sm rounded ${theme === 'vs-dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                      >
                        -
                      </button>
                      <span className={theme === 'vs-dark' ? 'text-white' : 'text-gray-800'}>
                        {fontSize}px
                      </span>
                      <button 
                        onClick={() => handleFontSizeChange(Math.min(24, fontSize + 2))}
                        className={`px-2 py-1 text-sm rounded ${theme === 'vs-dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Save and close buttons */}
            <button 
              onClick={handleSaveCode}
              className="p-2 rounded-full text-blue-400 hover:bg-gray-700"
              title="Save code"
            >
              <Save className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full text-red-400 hover:bg-gray-700"
              title="Close editor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Instructions (if provided) */}
        {instructions && (
          <div className={`p-4 ${theme === 'vs-dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'} border-b ${theme === 'vs-dark' ? 'border-gray-700' : 'border-gray-300'}`}>
            <h3 className="font-medium mb-1">Instructions:</h3>
            <div className="text-sm overflow-auto max-h-32 markdown-content">
              {instructions}
            </div>
          </div>
        )}
        
        {/* Main editor area */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Code editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={selectedLanguage}
              value={code}
              theme={theme}
              onChange={(value) => setCode(value || '')}
              onMount={handleEditorDidMount}
              options={{
                fontSize: fontSize,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </div>
          
          {/* Output panel */}
          <div className={`w-full md:w-1/3 flex flex-col ${theme === 'vs-dark' ? 'bg-gray-900' : 'bg-gray-100'} border-t md:border-t-0 md:border-l ${theme === 'vs-dark' ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className={`p-2 border-b ${theme === 'vs-dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-200'} flex justify-between items-center`}>
              <span className={`font-medium ${theme === 'vs-dark' ? 'text-white' : 'text-gray-800'}`}>Output</span>
              <div className="flex space-x-2">
                <button 
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className={`px-3 py-1 rounded text-sm flex items-center ${
                    isRunning
                      ? 'bg-green-700 opacity-75 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Run
                    </>
                  )}
                </button>
                <button 
                  onClick={handleResetCode}
                  className={`p-1 rounded ${theme === 'vs-dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-300 text-gray-600'}`}
                  title="Reset code"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleCopyCode}
                  className={`p-1 rounded ${theme === 'vs-dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-300 text-gray-600'}`}
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className={`flex-1 p-3 font-mono text-sm overflow-auto ${theme === 'vs-dark' ? 'text-gray-300 bg-gray-900' : 'text-gray-800 bg-white'}`}>
              {output || (
                <span className="text-gray-500 italic">
                  Output will appear here after running your code...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorComponent;